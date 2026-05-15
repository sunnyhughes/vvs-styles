-- Seed data for shirt customization options.
-- Apply AFTER seeds/shirts.sql, against the live D1 with:
--   wrangler d1 execute vvs-styles --remote --file=seeds/shirt_options.sql
--
-- Joins resolve by name/slug, not hard-coded ids, so this stays correct
-- regardless of the order rows landed in shirts/colors/programs.

-- Recovery programs (every shirt offers all three).
INSERT INTO programs (slug, name) VALUES
  ('aa',               'Alcoholics Anonymous'),
  ('na',               'Narcotics Anonymous'),
  ('anger-management', 'Anger Management');

-- Color options. Gender-neutral earth tones per DESIGN.md §1.
INSERT INTO colors (name, hex) VALUES
  ('Forest Green', '#166534'),
  ('Navy',         '#1E3A5F'),
  ('Cream',        '#F5F0E6'),
  ('Terracotta',   '#C2410C'),
  ('Stone Gray',   '#57534E');

-- Each shirt gets all three programs.
INSERT INTO shirt_programs (shirt_id, program_id)
SELECT s.id, p.id FROM shirts s, programs p;

-- Each shirt gets three color options.
INSERT INTO shirt_colors (shirt_id, color_id)
SELECT s.id, c.id FROM shirts s, colors c
WHERE (s.slug = 'still-here'          AND c.name IN ('Forest Green', 'Navy', 'Cream'))
   OR (s.slug = 'plot-twist'          AND c.name IN ('Navy', 'Terracotta', 'Stone Gray'))
   OR (s.slug = 'recovering-out-loud' AND c.name IN ('Forest Green', 'Cream', 'Terracotta'))
   OR (s.slug = 'worst-idea'          AND c.name IN ('Navy', 'Stone Gray', 'Forest Green'))
   OR (s.slug = 'whole-vibe'          AND c.name IN ('Cream', 'Terracotta', 'Stone Gray'));
