import { applyD1Migrations, env, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import type { Shirt } from "../../src/shared/types";

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  await env.DB.prepare(
    `INSERT INTO shirts (slug, name, base_price_cents, default_image_url, hero_phrase)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(
      "test-tee",
      "Test Tee",
      2800,
      "/placeholder-shirt.svg",
      "Still Here, Still Clean",
    )
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
