/** Bindings declared in `wrangler.toml`, available on `c.env`. */
export interface Env {
  DB: D1Database;
  /** Publishable Stripe key — safe to expose; lives in `wrangler.toml [vars]`. */
  STRIPE_PUBLISHABLE_KEY: string;
  /** Secret Stripe key — set via `wrangler secret put` (or `.dev.vars` locally). */
  STRIPE_SECRET_KEY: string;
}
