-- Migration 0001: initial catalog schema.
-- One row per shirt design. Per-shirt colour/program options arrive in Phase 2.
CREATE TABLE shirts (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  slug              TEXT    NOT NULL UNIQUE,
  name              TEXT    NOT NULL,
  base_price_cents  INTEGER NOT NULL,
  default_image_url TEXT    NOT NULL,
  hero_phrase       TEXT    NOT NULL
);
