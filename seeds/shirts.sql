-- Seed data for the shirts catalog.
-- Apply against the live D1 with:
--   wrangler d1 execute vvs-styles --remote --file=seeds/shirts.sql
--
-- Re-runnable: wipes shirt_colors + shirts first so the seed is the source
-- of truth. Apply seeds/shirt_options.sql AFTER this file.
--
-- v1 launches with the 7 'live' shirts. The other 18 are stored as 'draft'
-- so the catalog can grow without re-modeling — flip status to 'live' to
-- surface a shirt on /shop.
--
-- default_image_url is the stand-in tee mockup; replace per-shirt once
-- Phase 4 picks a print provider and real product photos exist.

DELETE FROM shirt_colors;
DELETE FROM shirts;
DELETE FROM sqlite_sequence WHERE name = 'shirts';

INSERT INTO shirts
  (slug, name, base_price_cents, default_image_url, hero_phrase, category, accent_image_url, status, cleantime_mode)
VALUES
  -- ── v1 live set ─────────────────────────────────────────────────────
  ('still-here',              'Still Here Tee',          2499, '/placeholder-shirt.svg', 'Still Here, Still Clean',         'Recovery',   NULL, 'live',  'years'),
  ('recovering-out-loud',     'Out Loud Tee',            2499, '/placeholder-shirt.svg', 'Recovering Out Loud',             'Recovery',   NULL, 'live',  'none'),
  ('worst-idea',              'Worst Idea Tee',          2499, '/placeholder-shirt.svg', 'I Survived My Own Worst Idea',    'Recovery',   NULL, 'live',  'none'),
  ('whole-vibe',              'Whole Vibe Tee',          2499, '/placeholder-shirt.svg', 'Cleantime Is a Whole Vibe',       'Recovery',   NULL, 'live',  'years'),
  ('feel-deal-heal',          'Feel Deal Heal Tee',      2499, '/placeholder-shirt.svg', 'Feel, Deal & Heal',               'Healing',    NULL, 'live',  'none'),
  ('past-future',             'Past Tee',                2499, '/placeholder-shirt.svg', 'Past Does NOT Dictate Future',    'Motivation', NULL, 'live',  'none'),
  ('clean-and-serene-since',  'Clean and Serene Tee',    2499, '/placeholder-shirt.svg', 'Clean and Serene Since',          'Recovery',   NULL, 'live',  'year_clean'),

  -- ── drafts (hidden from /shop until flipped to 'live') ──────────────
  ('lies-dies-flies',             'Lies Dies Flies Tee',          2499, '/placeholder-shirt.svg', 'No Matter Who Lies, Dies, or Flies',  'Recovery', NULL, 'draft', 'none'),
  ('dont-share-just-listen',      'Just Listen Tee',              2499, '/placeholder-shirt.svg', 'Don''t Share, Just Listen',           'Recovery', NULL, 'draft', 'none'),
  ('kiss',                        'K.I.S.S. Tee',                 2499, '/placeholder-shirt.svg', 'K.I.S.S.',                            'Recovery', NULL, 'draft', 'none'),
  ('no-matter-what-hashtag',      'No Matter What Hashtag Tee',   2499, '/placeholder-shirt.svg', '#NoMatterWhat',                       'Recovery', NULL, 'draft', 'none'),
  ('i-surrendered',               'I Surrendered Tee',            2499, '/placeholder-shirt.svg', 'I Surrendered',                       'Recovery', NULL, 'draft', 'year_clean'),
  ('best-day-god-made',           'Best Day Tee',                 2499, '/placeholder-shirt.svg', 'Best Day That God Ever Made',         'Recovery', NULL, 'draft', 'year_clean'),
  ('sat-down-shut-up',            'Sat Down Tee',                 2499, '/placeholder-shirt.svg', 'I Sat Down & Shut TF Up',             'Recovery', NULL, 'draft', 'none'),
  ('newcomer-most-important',     'Newcomer Tee',                 2499, '/placeholder-shirt.svg', 'Newcomer: The Most Important Person', 'Recovery', NULL, 'draft', 'none'),
  ('how',                         'H.O.W. Tee',                   2499, '/placeholder-shirt.svg', 'Honesty, Openmindedness & Willingness','Recovery', NULL, 'draft', 'none'),
  ('solution-steps',              'Solution Steps Tee',           2499, '/placeholder-shirt.svg', 'Solution = The Steps',                'Recovery', NULL, 'draft', 'none'),
  ('broader-the-base',            'Broader the Base Tee',         2499, '/placeholder-shirt.svg', 'Broader the Base',                    'Recovery', NULL, 'draft', 'none'),
  ('no-matter-what-club',         'No Matter What Club Tee',      2499, '/placeholder-shirt.svg', 'No Matter What Club',                 'Recovery', NULL, 'draft', 'none'),
  ('we-thing',                    'WE Thing Tee',                 2499, '/placeholder-shirt.svg', 'It''s A WE Thing',                    'Recovery', NULL, 'draft', 'none'),
  ('recovery-get-some',           'Recovery Get Some Tee',        2499, '/placeholder-shirt.svg', 'RECOVERY... Get Some',                'Recovery', NULL, 'draft', 'none'),
  ('safe-place-love',             'Safe Place Love Tee',          2499, '/placeholder-shirt.svg', 'My Safe Place Is LOVE',               'Healing',  NULL, 'draft', 'none'),
  ('love-hurts-heals',            'Love Hurts Heals Tee',         2499, '/placeholder-shirt.svg', 'Love Hurts & Heals',                  'Healing',  NULL, 'draft', 'none'),
  ('power-of-we',                 'Power of WE Tee',              2499, '/placeholder-shirt.svg', 'Power of the "WE"',                   'Recovery', NULL, 'draft', 'none'),
  ('principles-before-personality','Principles Before Personality Tee', 2499, '/placeholder-shirt.svg', 'Principles Before Personality or Prestige', 'Recovery', NULL, 'draft', 'none');
