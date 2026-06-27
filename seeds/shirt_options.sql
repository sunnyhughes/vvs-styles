-- Seed data for shirt customization options.
-- Apply AFTER seeds/shirts.sql, against the live D1 with:
--   wrangler d1 execute vvs-styles --remote --file=seeds/shirt_options.sql
--
-- Re-runnable: wipes colors + shirt_colors before reseeding.
-- Every shirt offers every color (six basics) for v1 — per-shirt color
-- curation comes later if the catalog grows enough to need it.

DELETE FROM shirt_colors;
DELETE FROM colors;
DELETE FROM sqlite_sequence WHERE name = 'colors';

-- v1 colors: the six basics from peer feedback (2026-05-29).
INSERT INTO colors (name, hex) VALUES
  ('White', '#FFFFFF'),
  ('Black', '#111111'),
  ('Gray',  '#6B7280'),
  ('Red',   '#DC2626'),
  ('Pink',  '#EC4899'),
  ('Blue',  '#2563EB');

-- Every shirt × every color.
INSERT INTO shirt_colors (shirt_id, color_id)
SELECT s.id, c.id FROM shirts s, colors c;

-- ── Per-color product photos (Phase 4) ──────────────────────────────────
-- Wire each shirt×color combo to its real Printify mockup under
-- /shirts/<slug>/<color>.<ext>. Combos left NULL fall back to the shirt's
-- default_image_url in the UI, so partial coverage never breaks the catalog.
-- Re-runnable: the cross-join above resets image_url to NULL each apply.
CREATE TEMP TABLE _img (slug TEXT, color TEXT, url TEXT);
INSERT INTO _img (slug, color, url) VALUES
  -- still-here (6/6)
  ('still-here','White','/shirts/still-here/white.png'),
  ('still-here','Black','/shirts/still-here/black.png'),
  ('still-here','Gray','/shirts/still-here/gray.png'),
  ('still-here','Red','/shirts/still-here/red.png'),
  ('still-here','Pink','/shirts/still-here/pink.png'),
  ('still-here','Blue','/shirts/still-here/blue.png'),
  -- whole-vibe (6/6)
  ('whole-vibe','White','/shirts/whole-vibe/white.png'),
  ('whole-vibe','Black','/shirts/whole-vibe/black.png'),
  ('whole-vibe','Gray','/shirts/whole-vibe/gray.png'),
  ('whole-vibe','Red','/shirts/whole-vibe/red.png'),
  ('whole-vibe','Pink','/shirts/whole-vibe/pink.png'),
  ('whole-vibe','Blue','/shirts/whole-vibe/blue.png'),
  -- recovering-out-loud (6/6)
  ('recovering-out-loud','White','/shirts/recovering-out-loud/white.png'),
  ('recovering-out-loud','Black','/shirts/recovering-out-loud/black.png'),
  ('recovering-out-loud','Gray','/shirts/recovering-out-loud/gray.png'),
  ('recovering-out-loud','Red','/shirts/recovering-out-loud/red.png'),
  ('recovering-out-loud','Pink','/shirts/recovering-out-loud/pink.png'),
  ('recovering-out-loud','Blue','/shirts/recovering-out-loud/blue.png'),
  -- worst-idea (4/6 — no gray/red mockup yet)
  ('worst-idea','White','/shirts/worst-idea/white.png'),
  ('worst-idea','Black','/shirts/worst-idea/black.png'),
  ('worst-idea','Pink','/shirts/worst-idea/pink.png'),
  ('worst-idea','Blue','/shirts/worst-idea/blue.png'),
  -- feel-deal-heal (4/6 — no gray/pink mockup yet)
  ('feel-deal-heal','White','/shirts/feel-deal-heal/white.jpg'),
  ('feel-deal-heal','Black','/shirts/feel-deal-heal/black.jpg'),
  ('feel-deal-heal','Red','/shirts/feel-deal-heal/red.jpg'),
  ('feel-deal-heal','Blue','/shirts/feel-deal-heal/blue.jpg'),
  -- clean-and-serene-since (1/6 — only gray mockup so far)
  ('clean-and-serene-since','Gray','/shirts/clean-and-serene-since/gray.png');

UPDATE shirt_colors
SET image_url = (
  SELECT i.url FROM _img i
  JOIN shirts s ON s.slug = i.slug
  JOIN colors c ON c.name = i.color
  WHERE s.id = shirt_colors.shirt_id AND c.id = shirt_colors.color_id
)
WHERE EXISTS (
  SELECT 1 FROM _img i
  JOIN shirts s ON s.slug = i.slug
  JOIN colors c ON c.name = i.color
  WHERE s.id = shirt_colors.shirt_id AND c.id = shirt_colors.color_id
);

DROP TABLE _img;
