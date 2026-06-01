import { Hono } from "hono";
import type {
  CleantimeMode,
  Color,
  Shirt,
  ShirtDetail,
} from "../../shared/types";
import type { Env } from "../types";

/** Routes mounted under `/api/shirts`. */
export const shirts = new Hono<{ Bindings: Env }>();

// GET /api/shirts — the live catalog, ordered for a stable grid. Drafts
// stay in D1 but never surface here.
shirts.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, slug, name, base_price_cents, default_image_url, hero_phrase
     FROM shirts
     WHERE status = 'live'
     ORDER BY id`,
  ).all<Shirt>();

  return c.json(results);
});

// GET /api/shirts/:slug — one live shirt plus its color options.
shirts.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const shirt = await c.env.DB.prepare(
    `SELECT id, slug, name, base_price_cents, default_image_url, hero_phrase,
            category, accent_image_url, cleantime_mode
     FROM shirts
     WHERE slug = ? AND status = 'live'`,
  )
    .bind(slug)
    .first<
      Shirt & {
        category: string | null;
        accent_image_url: string | null;
        cleantime_mode: CleantimeMode;
      }
    >();

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

  return c.json({ ...shirt, colors } satisfies ShirtDetail);
});
