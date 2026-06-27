-- Migration 0005: real product photos per shirt-color (Phase 4 imagery).
--
-- Each shirt × color now points at its own Printify mockup, served as a
-- static asset from `public/shirts/<slug>/<color>.<ext>`. Nullable on
-- purpose: a combo without a photo yet falls back to the shirt's
-- `default_image_url` in the UI, so the catalog never breaks mid-upload.
ALTER TABLE shirt_colors ADD COLUMN image_url TEXT;
