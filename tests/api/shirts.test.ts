import { applyD1Migrations, env, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import type { Color, Program, Shirt, ShirtDetail } from "../../src/shared/types";

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

  const shirt = await env.DB.prepare(
    `INSERT INTO shirts (slug, name, base_price_cents, default_image_url, hero_phrase)
     VALUES (?, ?, ?, ?, ?) RETURNING id`,
  )
    .bind(
      "test-tee",
      "Test Tee",
      2800,
      "/placeholder-shirt.svg",
      "Still Here, Still Clean",
    )
    .first<{ id: number }>();

  const color = await env.DB.prepare(
    `INSERT INTO colors (name, hex) VALUES (?, ?) RETURNING id`,
  )
    .bind("Forest Green", "#166534")
    .first<{ id: number }>();

  const program = await env.DB.prepare(
    `INSERT INTO programs (slug, name) VALUES (?, ?) RETURNING id`,
  )
    .bind("aa", "Alcoholics Anonymous")
    .first<{ id: number }>();

  await env.DB.prepare(
    `INSERT INTO shirt_colors (shirt_id, color_id) VALUES (?, ?)`,
  )
    .bind(shirt!.id, color!.id)
    .run();
  await env.DB.prepare(
    `INSERT INTO shirt_programs (shirt_id, program_id) VALUES (?, ?)`,
  )
    .bind(shirt!.id, program!.id)
    .run();
});

describe("GET /api/shirts", () => {
  it("returns 200 with a JSON array", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts");

    expect(res.status).toBe(200);
    const body = (await res.json()) as Shirt[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("returns the seeded shirt with every catalog field", async () => {
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
});

describe("GET /api/shirts/:slug", () => {
  it("returns the shirt with its color and program options", async () => {
    const res = await SELF.fetch("https://example.com/api/shirts/test-tee");

    expect(res.status).toBe(200);
    const body = (await res.json()) as ShirtDetail;
    expect(body.slug).toBe("test-tee");
    expect(body.colors).toEqual([
      expect.objectContaining<Partial<Color>>({
        name: "Forest Green",
        hex: "#166534",
      }),
    ]);
    expect(body.programs).toEqual([
      expect.objectContaining<Partial<Program>>({
        slug: "aa",
        name: "Alcoholics Anonymous",
      }),
    ]);
  });

  it("returns 404 for a slug that does not exist", async () => {
    const res = await SELF.fetch(
      "https://example.com/api/shirts/no-such-shirt",
    );
    expect(res.status).toBe(404);
  });
});
