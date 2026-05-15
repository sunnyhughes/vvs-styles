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
      projects: [
        {
          plugins: [
            cloudflareTest({
              wrangler: { configPath: "./wrangler.toml" },
              // D1 migrations are passed as a binding so tests can apply them
              // with `applyD1Migrations(env.DB, env.TEST_MIGRATIONS)`.
              miniflare: {
                bindings: { TEST_MIGRATIONS: migrations },
              },
            }),
          ],
          test: {
            name: "worker",
            include: ["tests/**/*.test.ts"],
          },
        },
        {
          plugins: [react()],
          test: {
            name: "client",
            environment: "jsdom",
            include: ["tests/**/*.test.tsx"],
            setupFiles: ["./tests/setup.client.ts"],
          },
        },
      ],
    },
  };
});
