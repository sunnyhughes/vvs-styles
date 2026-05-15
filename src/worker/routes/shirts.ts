import { Hono } from "hono";
import type { Shirt } from "../../shared/types";
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
