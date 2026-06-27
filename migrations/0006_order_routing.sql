-- Migration 0006: order routing + fulfillment tracking (Phase 4, hybrid dropship).
--
-- v1 fulfillment is HYBRID:
--   * Plain (non-personalized) shirts whose every line item resolves in
--     `shirt_variants` are auto-submitted to Printify's API.
--   * Personalized shirts (and any order we can't fully resolve) are routed to
--     the founder by email for manual entry in Printify — each personalized
--     order needs a unique print file (the buyer's clean-date), so there is no
--     fixed product to point the API at.
--
-- The map below starts EMPTY on purpose: with no rows, every order falls back
-- to the manual path, so the store is fully functional before any Printify
-- wiring exists. Populate `shirt_variants` (via the fetch script) to upgrade
-- a plain shirt to auto-submit — no code change required.

-- ── Fulfillment tracking on the existing orders table ────────────────────
-- 'auto'   = submitted to Printify via API
-- 'manual' = routed to the founder for hand entry
-- NULL     = not yet routed (order still 'pending'/'failed')
ALTER TABLE orders ADD COLUMN fulfillment_method TEXT;
ALTER TABLE orders ADD COLUMN dropship_order_id TEXT;          -- Printify order id (auto path)
ALTER TABLE orders ADD COLUMN submitted_to_dropship_at INTEGER; -- unix ms
ALTER TABLE orders ADD COLUMN tracking_url TEXT;               -- filled later (Printify webhook)
ALTER TABLE orders ADD COLUMN confirmation_email_sent_at INTEGER; -- unix ms

-- ── Variant "phone book": our (slug, color, size) → Printify ids ─────────
-- color matches colors.name ('White', 'Black', …); size matches the client
-- SIZES set ('S','M','L','XL','2XL'). One Printify product can hold many
-- variants, so product_id repeats across a shirt's rows.
CREATE TABLE shirt_variants (
  shirt_slug           TEXT    NOT NULL,
  color                TEXT    NOT NULL,
  size                 TEXT    NOT NULL,
  printify_product_id  TEXT    NOT NULL,
  printify_variant_id  INTEGER NOT NULL,
  PRIMARY KEY (shirt_slug, color, size)
);
