import { Hono } from "hono";
import type { Color, Program, Shirt, ShirtDetail } from "../../shared/types";
import type { Env } from "../types";

/** Routes mounted under `/api/shirts`. */
export const shirts = new Hono<{ Bindings: Env }>();

// GET /api/shirts — the full catalog, ordered for a stable grid.
shirts.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, slug, name, base_price_cents, default_image_url, hero_phrase
     FROM shirts
     ORDER BY id`,
  ).all<Shirt>();

  return c.json(results);
});

// GET /api/shirts/:slug — one shirt plus its color + program options.
shirts.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const shirt = await c.env.DB.prepare(
    `SELECT id, slug, name, base_price_cents, default_image_url, hero_phrase
     FROM shirts
     WHERE slug = ?`,
  )
    .bind(slug)
    .first<Shirt>();

  if (!shirt) {
    return c.json({ error: "Shirt not found" }, 404);
  }

  const { results: colors } = await c.env.DB.prepare(
    `SELECT c.id, c.name, c.hex
     FROM colors c
     JOIN shirt_colors sc ON sc.color_id = c.id
     WHERE sc.shirt_id = ?
     ORDER BY c.id`,
  )
    .bind(shirt.id)
    .all<Color>();

  const { results: programs } = await c.env.DB.prepare(
    `SELECT p.id, p.slug, p.name
     FROM programs p
     JOIN shirt_programs sp ON sp.program_id = p.id
     WHERE sp.shirt_id = ?
     ORDER BY p.id`,
  )
    .bind(shirt.id)
    .all<Program>();

  return c.json({ ...shirt, colors, programs } satisfies ShirtDetail);
});
