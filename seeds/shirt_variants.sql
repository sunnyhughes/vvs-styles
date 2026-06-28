-- Variant "phone book": our (shirt_slug, color, size) -> Printify ids.
-- Apply against the live D1 with:
--   wrangler d1 execute vvs-styles --remote --file=seeds/shirt_variants.sql
--
-- Re-runnable: wipes the table before reseeding.
--
-- Each row is built from the live Printify product via
-- scripts/printify-variants.mjs (run against the custom-integration shop,
-- 27707024). A row turns ON auto-submit for that shirt+color+size; any combo
-- missing here falls back to the manual founder-fulfillment path (migration 0006).
--
-- To add a shirt:
--   1. Run scripts/printify-variants.mjs <product_id> for that shirt.
--   2. Add one row per color+size we sell, mapping the Printify title's color
--      to our color name ('White','Black','Gray','Red','Pink','Blue') and size
--      ('S','M','L','XL','2XL').
--   3. Re-apply this file. No code change needed.
--
-- Only PLAIN shirts belong here. Personalized (year_clean) shirts always go
-- manual — each needs a unique print file (the buyer's clean-date) — so no rows.
--
-- Printify's color titles differ from our six basics, so we translate per shirt;
-- for listenin: Royal -> Blue, Ice Grey -> Gray, Heather Heliconia -> Pink
-- (White/Black map 1:1). The blueprint also offers XS/3XL/4XL/5XL and dozens of
-- colors we don't sell — all dropped.

DELETE FROM shirt_variants;

INSERT INTO shirt_variants (shirt_slug, color, size, printify_product_id, printify_variant_id) VALUES
  -- listenin — "Good E.S.H." (Printify product 6a29534b33921016810a2e6d, Unisex Softstyle Tee)
  ('listenin','White','S',  '6a29534b33921016810a2e6d', 38163),
  ('listenin','White','M',  '6a29534b33921016810a2e6d', 38177),
  ('listenin','White','L',  '6a29534b33921016810a2e6d', 38191),
  ('listenin','White','XL', '6a29534b33921016810a2e6d', 38205),
  ('listenin','White','2XL','6a29534b33921016810a2e6d', 38219),
  ('listenin','Black','S',  '6a29534b33921016810a2e6d', 38164),
  ('listenin','Black','M',  '6a29534b33921016810a2e6d', 38178),
  ('listenin','Black','L',  '6a29534b33921016810a2e6d', 38192),
  ('listenin','Black','XL', '6a29534b33921016810a2e6d', 38206),
  ('listenin','Black','2XL','6a29534b33921016810a2e6d', 38220),
  ('listenin','Gray','S',   '6a29534b33921016810a2e6d', 66241),
  ('listenin','Gray','M',   '6a29534b33921016810a2e6d', 66242),
  ('listenin','Gray','L',   '6a29534b33921016810a2e6d', 66243),
  ('listenin','Gray','XL',  '6a29534b33921016810a2e6d', 66244),
  ('listenin','Gray','2XL', '6a29534b33921016810a2e6d', 66245),
  ('listenin','Blue','S',   '6a29534b33921016810a2e6d', 38161),
  ('listenin','Blue','M',   '6a29534b33921016810a2e6d', 38175),
  ('listenin','Blue','L',   '6a29534b33921016810a2e6d', 38189),
  ('listenin','Blue','XL',  '6a29534b33921016810a2e6d', 38203),
  ('listenin','Blue','2XL', '6a29534b33921016810a2e6d', 38217),
  ('listenin','Pink','S',   '6a29534b33921016810a2e6d', 105257),
  ('listenin','Pink','M',   '6a29534b33921016810a2e6d', 105258),
  ('listenin','Pink','L',   '6a29534b33921016810a2e6d', 105259),
  ('listenin','Pink','XL',  '6a29534b33921016810a2e6d', 105260),
  ('listenin','Pink','2XL', '6a29534b33921016810a2e6d', 105261);
