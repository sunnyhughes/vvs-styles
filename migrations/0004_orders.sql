-- Migration 0004: orders + order_items (Phase 3, checkout).
--
-- One row in `orders` per checkout attempt. The id is a UUID (TEXT) generated
-- in the Worker via `crypto.randomUUID()` — the order id appears in the
-- `/order/confirmation/:id` URL, so a non-enumerable id keeps one buyer from
-- guessing another's order.
--
-- `order_items` is denormalized on purpose: a customer's receipt should show
-- the shirt name + unit price they saw at checkout, even if we later rename
-- the shirt or change its price in `shirts`.
--
-- Status flow: 'pending' (Payment Intent created) → 'paid' (Stripe confirmed
-- the PI succeeded and the amount matched our recorded total) | 'failed'.

CREATE TABLE orders (
  id                        TEXT    PRIMARY KEY,
  created_at                INTEGER NOT NULL,        -- unix ms
  email                     TEXT    NOT NULL,
  shipping_name             TEXT    NOT NULL,
  shipping_address_line1    TEXT    NOT NULL,
  shipping_address_line2    TEXT,                    -- nullable
  shipping_city             TEXT    NOT NULL,
  shipping_state            TEXT    NOT NULL,        -- 2-letter US state
  shipping_postal_code      TEXT    NOT NULL,
  shipping_country          TEXT    NOT NULL DEFAULT 'US',
  subtotal_cents            INTEGER NOT NULL,
  total_cents               INTEGER NOT NULL,        -- subtotal for v1 (no tax/shipping yet)
  status                    TEXT    NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid' | 'failed'
  stripe_payment_intent_id  TEXT                     -- set when PI is created
);

CREATE TABLE order_items (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id          TEXT    NOT NULL REFERENCES orders(id),
  shirt_slug        TEXT    NOT NULL,
  shirt_name        TEXT    NOT NULL,
  color             TEXT    NOT NULL,
  color_hex         TEXT    NOT NULL,
  size              TEXT    NOT NULL,
  cleantime_mode    TEXT    NOT NULL,     -- 'none' | 'years' | 'year_clean'
  cleantime_value   REAL    NOT NULL,     -- 0 if mode='none', else 3.5 (years) or 1953 (year)
  unit_price_cents  INTEGER NOT NULL,
  qty               INTEGER NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
