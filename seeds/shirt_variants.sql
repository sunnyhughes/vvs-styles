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
-- for listenin: Royal -> Blue, Ice Grey -> Gray, Heather Heliconia -> Pink,
-- solid Red -> Red (White/Black map 1:1). The blueprint offers XS/3XL/4XL/5XL and dozens of
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
  ('listenin','Red','S',    '6a29534b33921016810a2e6d', 38160),  -- Red (enabled later)
  ('listenin','Red','M',    '6a29534b33921016810a2e6d', 38174),  -- Red (enabled later)
  ('listenin','Red','L',    '6a29534b33921016810a2e6d', 38188),  -- Red (enabled later)
  ('listenin','Red','XL',   '6a29534b33921016810a2e6d', 38202),  -- Red (enabled later)
  ('listenin','Red','2XL',  '6a29534b33921016810a2e6d', 38216),  -- Red (enabled later)
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
  -- All 6 of our colors enabled. This blueprint's red = Cardinal Red,
  -- blue = Carolina Blue, gray = Ash, pink = Light Pink. (Ash/Light Pink were
  -- enabled here later; worst-idea/still-here use Ice Grey + Azalea instead, so
  -- gray/pink look slightly different between shirts — cosmetic, see backlog.)
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
  ('feel-deal-heal','Gray','S',   '6a3146490b7754dd070f4a08', 11850),  -- Ash
  ('feel-deal-heal','Gray','M',   '6a3146490b7754dd070f4a08', 11849),  -- Ash
  ('feel-deal-heal','Gray','L',   '6a3146490b7754dd070f4a08', 11848),  -- Ash
  ('feel-deal-heal','Gray','XL',  '6a3146490b7754dd070f4a08', 11851),  -- Ash
  ('feel-deal-heal','Gray','2XL', '6a3146490b7754dd070f4a08', 11852),  -- Ash
  ('feel-deal-heal','Pink','S',   '6a3146490b7754dd070f4a08', 11964),  -- Light Pink
  ('feel-deal-heal','Pink','M',   '6a3146490b7754dd070f4a08', 11963),  -- Light Pink
  ('feel-deal-heal','Pink','L',   '6a3146490b7754dd070f4a08', 11962),  -- Light Pink
  ('feel-deal-heal','Pink','XL',  '6a3146490b7754dd070f4a08', 11965),  -- Light Pink
  ('feel-deal-heal','Pink','2XL', '6a3146490b7754dd070f4a08', 11966),  -- Light Pink
  -- whole-vibe — "Cleantime is a whole VIBE" (Printify product 6a313e2e0b7754dd070f405e)
  -- All 6 colors enabled. Blue = Royal, Pink = Azalea, Red = solid Red,
  -- gray = Sport Grey (Ice Grey stays disabled here).
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
  ('whole-vibe','Red','S',    '6a313e2e0b7754dd070f405e', 38160),
  ('whole-vibe','Red','M',    '6a313e2e0b7754dd070f405e', 38174),
  ('whole-vibe','Red','L',    '6a313e2e0b7754dd070f405e', 38188),
  ('whole-vibe','Red','XL',   '6a313e2e0b7754dd070f405e', 38202),
  ('whole-vibe','Red','2XL',  '6a313e2e0b7754dd070f405e', 38216),
  ('whole-vibe','Blue','S',   '6a313e2e0b7754dd070f405e', 38161),
  ('whole-vibe','Blue','M',   '6a313e2e0b7754dd070f405e', 38175),
  ('whole-vibe','Blue','L',   '6a313e2e0b7754dd070f405e', 38189),
  ('whole-vibe','Blue','XL',  '6a313e2e0b7754dd070f405e', 38203),
  ('whole-vibe','Blue','2XL', '6a313e2e0b7754dd070f405e', 38217),
  ('whole-vibe','Pink','S',   '6a313e2e0b7754dd070f405e', 38224),
  ('whole-vibe','Pink','M',   '6a313e2e0b7754dd070f405e', 38226),
  ('whole-vibe','Pink','L',   '6a313e2e0b7754dd070f405e', 38228),
  ('whole-vibe','Pink','XL',  '6a313e2e0b7754dd070f405e', 38230),
  ('whole-vibe','Pink','2XL', '6a313e2e0b7754dd070f405e', 38232),
  ('whole-vibe','Gray','S',   '6a313e2e0b7754dd070f405e', 38162),  -- Sport Grey
  ('whole-vibe','Gray','M',   '6a313e2e0b7754dd070f405e', 38176),  -- Sport Grey
  ('whole-vibe','Gray','L',   '6a313e2e0b7754dd070f405e', 38190),  -- Sport Grey
  ('whole-vibe','Gray','XL',  '6a313e2e0b7754dd070f405e', 38204),  -- Sport Grey
  ('whole-vibe','Gray','2XL', '6a313e2e0b7754dd070f405e', 38218),  -- Sport Grey
  -- proud-recovering — "Proud to Be Recovering" Phoenix (Printify product 6a5fd48a554f7de18e0e7bec)
  -- Same Gildan Softstyle blueprint as whole-vibe/listenin. Blue = Royal,
  -- Pink = Azalea, Red = solid Red. GRAY = Dark Heather: this product has
  -- Sport Grey + Ice Grey DISABLED, so Dark Heather (darker/heathered) is the
  -- only enabled gray — enable Sport Grey in Printify + re-run if a lighter gray
  -- is wanted. All 6 colors x 5 sizes enabled.
  ('proud-recovering','White','S',  '6a5fd48a554f7de18e0e7bec', 38163),
  ('proud-recovering','White','M',  '6a5fd48a554f7de18e0e7bec', 38177),
  ('proud-recovering','White','L',  '6a5fd48a554f7de18e0e7bec', 38191),
  ('proud-recovering','White','XL', '6a5fd48a554f7de18e0e7bec', 38205),
  ('proud-recovering','White','2XL','6a5fd48a554f7de18e0e7bec', 38219),
  ('proud-recovering','Black','S',  '6a5fd48a554f7de18e0e7bec', 38164),
  ('proud-recovering','Black','M',  '6a5fd48a554f7de18e0e7bec', 38178),
  ('proud-recovering','Black','L',  '6a5fd48a554f7de18e0e7bec', 38192),
  ('proud-recovering','Black','XL', '6a5fd48a554f7de18e0e7bec', 38206),
  ('proud-recovering','Black','2XL','6a5fd48a554f7de18e0e7bec', 38220),
  ('proud-recovering','Red','S',    '6a5fd48a554f7de18e0e7bec', 38160),
  ('proud-recovering','Red','M',    '6a5fd48a554f7de18e0e7bec', 38174),
  ('proud-recovering','Red','L',    '6a5fd48a554f7de18e0e7bec', 38188),
  ('proud-recovering','Red','XL',   '6a5fd48a554f7de18e0e7bec', 38202),
  ('proud-recovering','Red','2XL',  '6a5fd48a554f7de18e0e7bec', 38216),
  ('proud-recovering','Blue','S',   '6a5fd48a554f7de18e0e7bec', 38161),  -- Royal
  ('proud-recovering','Blue','M',   '6a5fd48a554f7de18e0e7bec', 38175),  -- Royal
  ('proud-recovering','Blue','L',   '6a5fd48a554f7de18e0e7bec', 38189),  -- Royal
  ('proud-recovering','Blue','XL',  '6a5fd48a554f7de18e0e7bec', 38203),  -- Royal
  ('proud-recovering','Blue','2XL', '6a5fd48a554f7de18e0e7bec', 38217),  -- Royal
  ('proud-recovering','Pink','S',   '6a5fd48a554f7de18e0e7bec', 38224),  -- Azalea
  ('proud-recovering','Pink','M',   '6a5fd48a554f7de18e0e7bec', 38226),  -- Azalea
  ('proud-recovering','Pink','L',   '6a5fd48a554f7de18e0e7bec', 38228),  -- Azalea
  ('proud-recovering','Pink','XL',  '6a5fd48a554f7de18e0e7bec', 38230),  -- Azalea
  ('proud-recovering','Pink','2XL', '6a5fd48a554f7de18e0e7bec', 38232),  -- Azalea
  ('proud-recovering','Gray','S',   '6a5fd48a554f7de18e0e7bec', 63290),  -- Dark Heather
  ('proud-recovering','Gray','M',   '6a5fd48a554f7de18e0e7bec', 63295),  -- Dark Heather
  ('proud-recovering','Gray','L',   '6a5fd48a554f7de18e0e7bec', 63300),  -- Dark Heather
  ('proud-recovering','Gray','XL',  '6a5fd48a554f7de18e0e7bec', 63305),  -- Dark Heather
  ('proud-recovering','Gray','2XL', '6a5fd48a554f7de18e0e7bec', 63310),  -- Dark Heather
  -- past-future — "Past does not dictate Future" Minimalist (Printify product 6a52bcb9aeb508bd5c005bda)
  -- Same Gildan Heavy Cotton blueprint as worst-idea/still-here (12xxx ids).
  -- Blue = Royal, Pink = Azalea, Red = solid Red, Gray = Sport Grey (enabled
  -- here, so a true light gray). All 6 colors x 5 sizes enabled.
  ('past-future','White','S',  '6a52bcb9aeb508bd5c005bda', 12102),
  ('past-future','White','M',  '6a52bcb9aeb508bd5c005bda', 12101),
  ('past-future','White','L',  '6a52bcb9aeb508bd5c005bda', 12100),
  ('past-future','White','XL', '6a52bcb9aeb508bd5c005bda', 12103),
  ('past-future','White','2XL','6a52bcb9aeb508bd5c005bda', 12104),
  ('past-future','Black','S',  '6a52bcb9aeb508bd5c005bda', 12126),
  ('past-future','Black','M',  '6a52bcb9aeb508bd5c005bda', 12125),
  ('past-future','Black','L',  '6a52bcb9aeb508bd5c005bda', 12124),
  ('past-future','Black','XL', '6a52bcb9aeb508bd5c005bda', 12127),
  ('past-future','Black','2XL','6a52bcb9aeb508bd5c005bda', 12128),
  ('past-future','Red','S',    '6a52bcb9aeb508bd5c005bda', 12024),
  ('past-future','Red','M',    '6a52bcb9aeb508bd5c005bda', 12023),
  ('past-future','Red','L',    '6a52bcb9aeb508bd5c005bda', 12022),
  ('past-future','Red','XL',   '6a52bcb9aeb508bd5c005bda', 12025),
  ('past-future','Red','2XL',  '6a52bcb9aeb508bd5c005bda', 12026),
  ('past-future','Blue','S',   '6a52bcb9aeb508bd5c005bda', 12030),  -- Royal
  ('past-future','Blue','M',   '6a52bcb9aeb508bd5c005bda', 12029),  -- Royal
  ('past-future','Blue','L',   '6a52bcb9aeb508bd5c005bda', 12028),  -- Royal
  ('past-future','Blue','XL',  '6a52bcb9aeb508bd5c005bda', 12031),  -- Royal
  ('past-future','Blue','2XL', '6a52bcb9aeb508bd5c005bda', 12032),  -- Royal
  ('past-future','Pink','S',   '6a52bcb9aeb508bd5c005bda', 12120),  -- Azalea
  ('past-future','Pink','M',   '6a52bcb9aeb508bd5c005bda', 12119),  -- Azalea
  ('past-future','Pink','L',   '6a52bcb9aeb508bd5c005bda', 12118),  -- Azalea
  ('past-future','Pink','XL',  '6a52bcb9aeb508bd5c005bda', 12121),  -- Azalea
  ('past-future','Pink','2XL', '6a52bcb9aeb508bd5c005bda', 12122),  -- Azalea
  ('past-future','Gray','S',   '6a52bcb9aeb508bd5c005bda', 12072),  -- Sport Grey
  ('past-future','Gray','M',   '6a52bcb9aeb508bd5c005bda', 12071),  -- Sport Grey
  ('past-future','Gray','L',   '6a52bcb9aeb508bd5c005bda', 12070),  -- Sport Grey
  ('past-future','Gray','XL',  '6a52bcb9aeb508bd5c005bda', 12073),  -- Sport Grey
  ('past-future','Gray','2XL', '6a52bcb9aeb508bd5c005bda', 12074);  -- Sport Grey
