/// <reference types="@cloudflare/vitest-pool-workers/types" />

// Augments the `cloudflare:test` environment with bindings the tests rely on.
import type { D1Migration } from "@cloudflare/vitest-pool-workers";

declare global {
  namespace Cloudflare {
    interface Env {
      /** D1 binding declared in `wrangler.toml`. */
      DB: D1Database;
      /** Migrations injected by `vitest.config.ts` via `readD1Migrations`. */
      TEST_MIGRATIONS: D1Migration[];
      /** Stripe keys — stubbed in tests; real values live in `wrangler.toml` + `.dev.vars`. */
      STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
    }
  }
}

export {};
