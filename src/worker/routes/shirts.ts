import { Hono } from "hono";
import type {
  CleantimeMode,
  Color,
  ColorSwatch,
  Shirt,
  ShirtDetail,
  ShirtSummary,
} from "../../shared/types";
import type { Env } from "../types";

/** Routes mounted under `/api/shirts`. */
export const shirts = new Hono<{ Bindings: Env }>();

// GET /api/shirts — the live catalog, ordered for a stable grid. Drafts
// stay in D1 but never surface here. Each shirt carries its color swatches
// so the grid can hint that other colors are available.
shirts.get("/", async (c) => {
  const { results: rows } = await c.env.DB.prepare(
    `SELECT id, slug, name, base_price_cents, default_image_url, hero_phrase
     FROM shirts
     WHERE status = 'live'
     ORDER BY id`,
  ).all<Shirt>();

  // All swatches for every live shirt in one query, then grouped in JS —
  // avoids an N+1 of one colors query per shirt.
  const { results: swatchRows } = await c.env.DB.prepare(
    `SELECT sc.shirt_id AS shirt_id, c.name, c.hex
     FROM shirt_colors sc
     JOIN colors c ON c.id = sc.color_id
     JOIN shirts s ON s.id = sc.shirt_id
     WHERE s.status = 'live'
     ORDER BY sc.shirt_id, c.id`,
  ).all<{ shirt_id: number } & ColorSwatch>();

  const swatchesByShirt = new Map<number, ColorSwatch[]>();
  for (const { shirt_id, name, hex } of swatchRows) {
    const list = swatchesByShirt.get(shirt_id) ?? [];
    list.push({ name, hex });
    swatchesByShirt.set(shirt_id, list);
  }

  const catalog: ShirtSummary[] = rows.map((s) => ({
    ...s,
    colors: swatchesByShirt.get(s.id) ?? [],
  }));

  return c.json(catalog);
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
    `SELECT c.id, c.name, c.hex, sc.image_url
     FROM colors c
     JOIN shirt_colors sc ON sc.color_id = c.id
     WHERE sc.shirt_id = ?
     ORDER BY c.id`,
  )
    .bind(shirt.id)
    .all<Color>();

  return c.json({ ...shirt, colors } satisfies ShirtDetail);
});
