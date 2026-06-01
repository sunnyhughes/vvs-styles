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
