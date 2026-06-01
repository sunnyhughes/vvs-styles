import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Two Vitest projects:
//  - "worker": runs `*.test.ts` inside the real Workers runtime (Miniflare).
//  - "client": runs `*.test.tsx` React component tests in a jsdom DOM.
export default defineConfig(async () => {
  const migrations = await readD1Migrations("./migrations");

  return {
    test: {
      // Worker pool cold-start + per-test isolated storage can push some
      // tests past the 5s default; 15s leaves comfortable headroom.
      testTimeout: 15000,
      projects: [
        {
          plugins: [
            cloudflareTest({
              wrangler: { configPath: "./wrangler.toml" },
              // D1 migrations are passed as a binding so tests can apply them
              // with `applyD1Migrations(env.DB, env.TEST_MIGRATIONS)`.
              miniflare: {
                bindings: {
                  TEST_MIGRATIONS: migrations,
                  // Stripe keys are stubs: tests mock `src/worker/lib/stripe`
                  // so the SDK is never instantiated with these — they only
                  // satisfy the Env type at runtime.
                  STRIPE_PUBLISHABLE_KEY: "pk_test_dummy",
                  STRIPE_SECRET_KEY: "sk_test_dummy",
                },
              },
            }),
          ],
          test: {
            name: "worker",
            include: ["tests/**/*.test.ts"],
            // `tests/lib/*` exercises browser APIs (localStorage) — those run
            // in the jsdom "client" project below, not the Workers runtime.
            exclude: ["tests/lib/**"],
          },
        },
        {
          plugins: [react()],
          test: {
            name: "client",
            environment: "jsdom",
            include: ["tests/**/*.test.tsx", "tests/lib/**/*.test.ts"],
            setupFiles: ["./tests/setup.client.ts"],
          },
        },
      ],
    },
  };
});
