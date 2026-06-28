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
  ('listenin','Pink','2XL', '6a29534b33921016810a2e6d', 105261),
  -- worst-idea — "I Survived My Own Worst Idea" (Printify product 6a3e6b452e847d86d80e1713)
  -- this blueprint's pink is "Azalea" (not Heliconia); all 6 colors enabled.
  ('worst-idea','White','S',  '6a3e6b452e847d86d80e1713', 12102),
  ('worst-idea','White','M',  '6a3e6b452e847d86d80e1713', 12101),
  ('worst-idea','White','L',  '6a3e6b452e847d86d80e1713', 12100),
  ('worst-idea','White','XL', '6a3e6b452e847d86d80e1713', 12103),
  ('worst-idea','White','2XL','6a3e6b452e847d86d80e1713', 12104),
  ('worst-idea','Black','S',  '6a3e6b452e847d86d80e1713', 12126),
  ('worst-idea','Black','M',  '6a3e6b452e847d86d80e1713', 12125),
  ('worst-idea','Black','L',  '6a3e6b452e847d86d80e1713', 12124),
  ('worst-idea','Black','XL', '6a3e6b452e847d86d80e1713', 12127),
  ('worst-idea','Black','2XL','6a3e6b452e847d86d80e1713', 12128),
  ('worst-idea','Gray','S',   '6a3e6b452e847d86d80e1713', 12162),
  ('worst-idea','Gray','M',   '6a3e6b452e847d86d80e1713', 12161),
  ('worst-idea','Gray','L',   '6a3e6b452e847d86d80e1713', 12160),
  ('worst-idea','Gray','XL',  '6a3e6b452e847d86d80e1713', 12163),
  ('worst-idea','Gray','2XL', '6a3e6b452e847d86d80e1713', 12164),
  ('worst-idea','Red','S',    '6a3e6b452e847d86d80e1713', 12024),
  ('worst-idea','Red','M',    '6a3e6b452e847d86d80e1713', 12023),
  ('worst-idea','Red','L',    '6a3e6b452e847d86d80e1713', 12022),
  ('worst-idea','Red','XL',   '6a3e6b452e847d86d80e1713', 12025),
  ('worst-idea','Red','2XL',  '6a3e6b452e847d86d80e1713', 12026),
  ('worst-idea','Blue','S',   '6a3e6b452e847d86d80e1713', 12030),
  ('worst-idea','Blue','M',   '6a3e6b452e847d86d80e1713', 12029),
  ('worst-idea','Blue','L',   '6a3e6b452e847d86d80e1713', 12028),
  ('worst-idea','Blue','XL',  '6a3e6b452e847d86d80e1713', 12031),
  ('worst-idea','Blue','2XL', '6a3e6b452e847d86d80e1713', 12032),
  ('worst-idea','Pink','S',   '6a3e6b452e847d86d80e1713', 12120),
  ('worst-idea','Pink','M',   '6a3e6b452e847d86d80e1713', 12119),
  ('worst-idea','Pink','L',   '6a3e6b452e847d86d80e1713', 12118),
  ('worst-idea','Pink','XL',  '6a3e6b452e847d86d80e1713', 12121),
  ('worst-idea','Pink','2XL', '6a3e6b452e847d86d80e1713', 12122),
  -- still-here — "Still Here Still Clean" (Printify product 6a2b345560b8e9be09099f40)
  -- NOTE: this product's blue/red are HEATHERED: Heather Sapphire -> Blue,
  -- Heather Red -> Red (worst-idea uses solid Royal/Red). Azalea -> Pink.
  ('still-here','White','S',  '6a2b345560b8e9be09099f40', 12102),
  ('still-here','White','M',  '6a2b345560b8e9be09099f40', 12101),
  ('still-here','White','L',  '6a2b345560b8e9be09099f40', 12100),
  ('still-here','White','XL', '6a2b345560b8e9be09099f40', 12103),
  ('still-here','White','2XL','6a2b345560b8e9be09099f40', 12104),
  ('still-here','Black','S',  '6a2b345560b8e9be09099f40', 12126),
  ('still-here','Black','M',  '6a2b345560b8e9be09099f40', 12125),
  ('still-here','Black','L',  '6a2b345560b8e9be09099f40', 12124),
  ('still-here','Black','XL', '6a2b345560b8e9be09099f40', 12127),
  ('still-here','Black','2XL','6a2b345560b8e9be09099f40', 12128),
  ('still-here','Gray','S',   '6a2b345560b8e9be09099f40', 12162),
  ('still-here','Gray','M',   '6a2b345560b8e9be09099f40', 12161),
  ('still-here','Gray','L',   '6a2b345560b8e9be09099f40', 12160),
  ('still-here','Gray','XL',  '6a2b345560b8e9be09099f40', 12163),
  ('still-here','Gray','2XL', '6a2b345560b8e9be09099f40', 12164),
  ('still-here','Pink','S',   '6a2b345560b8e9be09099f40', 12120),
  ('still-here','Pink','M',   '6a2b345560b8e9be09099f40', 12119),
  ('still-here','Pink','L',   '6a2b345560b8e9be09099f40', 12118),
  ('still-here','Pink','XL',  '6a2b345560b8e9be09099f40', 12121),
  ('still-here','Pink','2XL', '6a2b345560b8e9be09099f40', 12122),
  ('still-here','Blue','S',   '6a2b345560b8e9be09099f40', 11940),
  ('still-here','Blue','M',   '6a2b345560b8e9be09099f40', 11939),
  ('still-here','Blue','L',   '6a2b345560b8e9be09099f40', 11938),
  ('still-here','Blue','XL',  '6a2b345560b8e9be09099f40', 11941),
  ('still-here','Blue','2XL', '6a2b345560b8e9be09099f40', 11942),
  ('still-here','Red','S',    '6a2b345560b8e9be09099f40', 11934),
  ('still-here','Red','M',    '6a2b345560b8e9be09099f40', 11933),
  ('still-here','Red','L',    '6a2b345560b8e9be09099f40', 11932),
  ('still-here','Red','XL',   '6a2b345560b8e9be09099f40', 11935),
  ('still-here','Red','2XL',  '6a2b345560b8e9be09099f40', 11936),
  -- feel-deal-heal — "Feel Deal Heal" (Printify product 6a3146490b7754dd070f4a08)
  -- Only 4 of our colors enabled (no Gray/Pink on this product). This blueprint's
  -- red = Cardinal Red, blue = Carolina Blue.
  ('feel-deal-heal','White','S',  '6a3146490b7754dd070f4a08', 12102),
  ('feel-deal-heal','White','M',  '6a3146490b7754dd070f4a08', 12101),
  ('feel-deal-heal','White','L',  '6a3146490b7754dd070f4a08', 12100),
  ('feel-deal-heal','White','XL', '6a3146490b7754dd070f4a08', 12103),
  ('feel-deal-heal','White','2XL','6a3146490b7754dd070f4a08', 12104),
  ('feel-deal-heal','Black','S',  '6a3146490b7754dd070f4a08', 12126),
  ('feel-deal-heal','Black','M',  '6a3146490b7754dd070f4a08', 12125),
  ('feel-deal-heal','Black','L',  '6a3146490b7754dd070f4a08', 12124),
  ('feel-deal-heal','Black','XL', '6a3146490b7754dd070f4a08', 12127),
  ('feel-deal-heal','Black','2XL','6a3146490b7754dd070f4a08', 12128),
  ('feel-deal-heal','Red','S',    '6a3146490b7754dd070f4a08', 12132),
  ('feel-deal-heal','Red','M',    '6a3146490b7754dd070f4a08', 12131),
  ('feel-deal-heal','Red','L',    '6a3146490b7754dd070f4a08', 12130),
  ('feel-deal-heal','Red','XL',   '6a3146490b7754dd070f4a08', 12133),
  ('feel-deal-heal','Red','2XL',  '6a3146490b7754dd070f4a08', 12134),
  ('feel-deal-heal','Blue','S',   '6a3146490b7754dd070f4a08', 11868),
  ('feel-deal-heal','Blue','M',   '6a3146490b7754dd070f4a08', 11867),
  ('feel-deal-heal','Blue','L',   '6a3146490b7754dd070f4a08', 11866),
  ('feel-deal-heal','Blue','XL',  '6a3146490b7754dd070f4a08', 11869),
  ('feel-deal-heal','Blue','2XL', '6a3146490b7754dd070f4a08', 11870),
  -- whole-vibe — "Cleantime is a whole VIBE" (Printify product 6a313e2e0b7754dd070f405e)
  -- Only 3 colors enabled (no Gray/Red/Pink on this product). Blue = Antique Sapphire.
  ('whole-vibe','White','S',  '6a313e2e0b7754dd070f405e', 38163),
  ('whole-vibe','White','M',  '6a313e2e0b7754dd070f405e', 38177),
  ('whole-vibe','White','L',  '6a313e2e0b7754dd070f405e', 38191),
  ('whole-vibe','White','XL', '6a313e2e0b7754dd070f405e', 38205),
  ('whole-vibe','White','2XL','6a313e2e0b7754dd070f405e', 38219),
  ('whole-vibe','Black','S',  '6a313e2e0b7754dd070f405e', 38164),
  ('whole-vibe','Black','M',  '6a313e2e0b7754dd070f405e', 38178),
  ('whole-vibe','Black','L',  '6a313e2e0b7754dd070f405e', 38192),
  ('whole-vibe','Black','XL', '6a313e2e0b7754dd070f405e', 38206),
  ('whole-vibe','Black','2XL','6a313e2e0b7754dd070f405e', 38220),
  ('whole-vibe','Blue','S',   '6a313e2e0b7754dd070f405e', 42794),
  ('whole-vibe','Blue','M',   '6a313e2e0b7754dd070f405e', 42797),
  ('whole-vibe','Blue','L',   '6a313e2e0b7754dd070f405e', 42800),
  ('whole-vibe','Blue','XL',  '6a313e2e0b7754dd070f405e', 42803),
  ('whole-vibe','Blue','2XL', '6a313e2e0b7754dd070f405e', 42806);
