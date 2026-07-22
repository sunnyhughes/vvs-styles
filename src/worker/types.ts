/** Bindings declared in `wrangler.toml`, available on `c.env`. */
export interface Env {
  DB: D1Database;
  /** Publishable Stripe key — safe to expose; lives in `wrangler.toml [vars]`. */
  STRIPE_PUBLISHABLE_KEY: string;
  /** Secret Stripe key — set via `wrangler secret put` (or `.dev.vars` locally). */
  STRIPE_SECRET_KEY: string;

  // ── Phase 4: fulfillment + transactional email ──────────────────────────
  // All optional: when a value is missing the worker degrades gracefully —
  // missing Printify config routes orders to the manual founder path, and a
  // missing Resend key skips the send (logged), so checkout never 500s on a
  // misconfigured environment.
  /** Resend API key — set via `wrangler secret put RESEND_API_KEY`. */
  RESEND_API_KEY?: string;
  /** Verified "from" address for customer + founder email, e.g. orders@vv-styles.com. [vars] */
  EMAIL_FROM?: string;
  /** Where founder/manual-fulfillment alerts go. [vars] */
  FOUNDER_EMAIL?: string;
  /** Printify Personal Access Token — `wrangler secret put PRINTIFY_API_TOKEN`. */
  PRINTIFY_API_TOKEN?: string;
  /** Printify shop id (from GET /v1/shops.json). [vars] */
  PRINTIFY_SHOP_ID?: string;
}
