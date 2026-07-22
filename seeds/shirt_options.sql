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
--
-- NOTE: plain per-row UPDATEs on purpose — remote D1's SQL authorizer rejects
-- CREATE TEMP TABLE (SQLITE_AUTH), so no temp-table staging here.
-- Re-runnable: the cross-join above resets image_url to NULL each apply.
-- still-here (6/6)
UPDATE shirt_colors SET image_url = '/shirts/still-here/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'still-here') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/still-here/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'still-here') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/still-here/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'still-here') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/still-here/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'still-here') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/still-here/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'still-here') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/still-here/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'still-here') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- whole-vibe (6/6)
UPDATE shirt_colors SET image_url = '/shirts/whole-vibe/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'whole-vibe') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/whole-vibe/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'whole-vibe') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/whole-vibe/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'whole-vibe') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/whole-vibe/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'whole-vibe') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/whole-vibe/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'whole-vibe') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/whole-vibe/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'whole-vibe') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- recovering-out-loud (6/6)
UPDATE shirt_colors SET image_url = '/shirts/recovering-out-loud/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovering-out-loud') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/recovering-out-loud/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovering-out-loud') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/recovering-out-loud/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovering-out-loud') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/recovering-out-loud/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovering-out-loud') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/recovering-out-loud/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovering-out-loud') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/recovering-out-loud/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovering-out-loud') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- worst-idea (6/6)
UPDATE shirt_colors SET image_url = '/shirts/worst-idea/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'worst-idea') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/worst-idea/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'worst-idea') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/worst-idea/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'worst-idea') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/worst-idea/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'worst-idea') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/worst-idea/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'worst-idea') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/worst-idea/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'worst-idea') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- feel-deal-heal (6/6)
UPDATE shirt_colors SET image_url = '/shirts/feel-deal-heal/white.jpg' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'feel-deal-heal') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/feel-deal-heal/black.jpg' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'feel-deal-heal') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/feel-deal-heal/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'feel-deal-heal') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/feel-deal-heal/red.jpg' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'feel-deal-heal') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/feel-deal-heal/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'feel-deal-heal') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/feel-deal-heal/blue.jpg' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'feel-deal-heal') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- clean-and-serene-since (6/6)
UPDATE shirt_colors SET image_url = '/shirts/clean-and-serene-since/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'clean-and-serene-since') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/clean-and-serene-since/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'clean-and-serene-since') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/clean-and-serene-since/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'clean-and-serene-since') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/clean-and-serene-since/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'clean-and-serene-since') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/clean-and-serene-since/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'clean-and-serene-since') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/clean-and-serene-since/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'clean-and-serene-since') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- recovery-est (6/6)
UPDATE shirt_colors SET image_url = '/shirts/recovery-est/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovery-est') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/recovery-est/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovery-est') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/recovery-est/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovery-est') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/recovery-est/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovery-est') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/recovery-est/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovery-est') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/recovery-est/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'recovery-est') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- listenin (6/6)
UPDATE shirt_colors SET image_url = '/shirts/listenin/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'listenin') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/listenin/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'listenin') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/listenin/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'listenin') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/listenin/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'listenin') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/listenin/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'listenin') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/listenin/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'listenin') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- proud-recovering (6/6)
UPDATE shirt_colors SET image_url = '/shirts/proud-recovering/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'proud-recovering') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/proud-recovering/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'proud-recovering') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/proud-recovering/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'proud-recovering') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/proud-recovering/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'proud-recovering') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/proud-recovering/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'proud-recovering') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/proud-recovering/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'proud-recovering') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
-- past-future (6/6)
UPDATE shirt_colors SET image_url = '/shirts/past-future/white.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'past-future') AND color_id = (SELECT id FROM colors WHERE name = 'White');
UPDATE shirt_colors SET image_url = '/shirts/past-future/black.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'past-future') AND color_id = (SELECT id FROM colors WHERE name = 'Black');
UPDATE shirt_colors SET image_url = '/shirts/past-future/gray.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'past-future') AND color_id = (SELECT id FROM colors WHERE name = 'Gray');
UPDATE shirt_colors SET image_url = '/shirts/past-future/red.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'past-future') AND color_id = (SELECT id FROM colors WHERE name = 'Red');
UPDATE shirt_colors SET image_url = '/shirts/past-future/pink.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'past-future') AND color_id = (SELECT id FROM colors WHERE name = 'Pink');
UPDATE shirt_colors SET image_url = '/shirts/past-future/blue.png' WHERE shirt_id = (SELECT id FROM shirts WHERE slug = 'past-future') AND color_id = (SELECT id FROM colors WHERE name = 'Blue');
