import { applyD1Migrations, env, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import type {
  Color,
  Shirt,
  ShirtDetail,
  ShirtSummary,
} from "../../src/shared/types";

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

  const shirt = await env.DB.prepare(
    `INSERT INTO shirts
       (slug, name, base_price_cents, default_image_url, hero_phrase,
        category, status, cleantime_mode)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
  )
    .bind(
      "test-tee",
      "Test Tee",
      2800,
      "/placeholder-shirt.svg",
      "Still Here, Still Clean",
      "Recovery",
      "live",
      "years",
    )
    .first<{ id: number }>();

  const color = await env.DB.prepare(
    `INSERT INTO colors (name, hex) VALUES (?, ?) RETURNING id`,
  )
    .bind("White", "#FFFFFF")
    .first<{ id: number }>();

  await env.DB.prepare(
    `INSERT INTO shirt_colors (shirt_id, color_id, image_url) VALUES (?, ?, ?)`,
  )
    .bind(shirt!.id, color!.id, "/shirts/test-tee/white.png")
    .run();

  // A draft shirt — must not surface in either endpoint.
  await env.DB.prepare(
    `INSERT INTO shirts
       (slug, name, base_price_cents, default_image_url, hero_phrase, status, cleantime_mode)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      "draft-tee",
      "Draft Tee",
      2800,
      "/placeholder-shirt.svg",
      "Hidden",
      "draft",
      "none",
    )
    .run();
});

describe("GET /api/shirts", () => {
  it("returns 200 with a JSON array of live shirts", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts");

    expect(res.status).toBe(200);
    const body = (await res.json()) as Shirt[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("returns the live shirt with every catalog field", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts");
    const body = (await res.json()) as Shirt[];

    const tee = body.find((s) => s.slug === "test-tee");
    expect(tee).toMatchObject({
      slug: "test-tee",
      name: "Test Tee",
      base_price_cents: 2800,
      default_image_url: "/placeholder-shirt.svg",
      hero_phrase: "Still Here, Still Clean",
    });
  });

  it("hides draft shirts from the catalog", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts");
    const body = (await res.json()) as Shirt[];
    expect(body.find((s) => s.slug === "draft-tee")).toBeUndefined();
  });

  it("includes color swatches for each shirt", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts");
    const body = (await res.json()) as ShirtSummary[];
    const tee = body.find((s) => s.slug === "test-tee");
    expect(tee?.colors).toEqual([
      expect.objectContaining({ name: "White", hex: "#FFFFFF" }),
    ]);
  });
});

describe("GET /api/shirts/:slug", () => {
  it("returns the shirt with its color options + customization metadata", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts/test-tee");

    expect(res.status).toBe(200);
    const body = (await res.json()) as ShirtDetail;
    expect(body).toMatchObject({
      slug: "test-tee",
      category: "Recovery",
      cleantime_mode: "years",
      accent_image_url: null,
    });
    expect(body.colors).toEqual([
      expect.objectContaining<Partial<Color>>({
        name: "White",
        hex: "#FFFFFF",
        image_url: "/shirts/test-tee/white.png",
      }),
    ]);
  });

  it("returns 404 for a draft shirt", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts/draft-tee");
    expect(res.status).toBe(404);
  });

  it("returns 404 for a slug that does not exist", async () => {
    const res = await SELF.fetch(
      "https://example.com/api/shirts/no-such-shirt",
    );
    expect(res.status).toBe(404);
  });
});
