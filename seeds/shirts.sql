-- Seed data for the shirts catalog.
-- Apply against the live D1 with:
--   wrangler d1 execute vvs-styles --remote --file=seeds/shirts.sql
--
-- TODO: hero_phrase values below are placeholder mock phrases. Replace them
-- with the real "that should be on a shirt" catalogue once it is gathered
-- (see DESIGN.md §7 — the insider phrases are not catalogued yet).
INSERT INTO shirts (slug, name, base_price_cents, default_image_url, hero_phrase) VALUES
  ('still-here',          'Still Here Tee', 2800, '/placeholder-shirt.svg', 'Still Here, Still Clean'),
  ('plot-twist',          'Plot Twist Tee', 2800, '/placeholder-shirt.svg', 'Plot Twist: I Made It'),
  ('recovering-out-loud', 'Out Loud Tee',   3000, '/placeholder-shirt.svg', 'Recovering Out Loud'),
  ('worst-idea',          'Worst Idea Tee', 3000, '/placeholder-shirt.svg', 'I Survived My Own Worst Idea'),
  ('whole-vibe',          'Whole Vibe Tee', 3200, '/placeholder-shirt.svg', 'Cleantime Is a Whole Vibe');
