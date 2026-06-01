-- Migration 0003: v1 polish (Phase 2.5).
--
-- Drops the per-product "program" selector after the 2026-05-29 peer review:
-- a program only matters when a phrase is program-specific, otherwise it
-- holds no weight. Phrase category (Recovery / Healing / Motivation) takes
-- its place as the future /shop filter once the catalog passes ~10 designs.
--
-- Also extends `shirts` for the growing catalog:
--   - status         : 'draft' or 'live'. Only 'live' shirts surface on /shop.
--   - cleantime_mode : 'none' | 'years' | 'year_clean'. Per-shirt — most
--                      phrases are standalone; some take years-clean; some
--                      take the year the customer got clean.
--   - category       : nullable for now; fill in as the filter UI nears.
--   - accent_image_url : optional accompanying graphic for phrases that
--                        carry one (provider mockups land in Phase 4).

DROP TABLE shirt_programs;
DROP TABLE programs;

ALTER TABLE shirts ADD COLUMN category         TEXT;
ALTER TABLE shirts ADD COLUMN accent_image_url TEXT;
ALTER TABLE shirts ADD COLUMN status           TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE shirts ADD COLUMN cleantime_mode   TEXT NOT NULL DEFAULT 'none';
