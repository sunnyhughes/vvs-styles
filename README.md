# vvs-styles

Recovery-apparel storefront. Shirts that reference 12-step programs and clean-time milestones — designed for people in recovery, by someone in recovery.

🔗 **Live site:** [https://vvs-styles.sunshinehughes.workers.dev](https://vvs-styles.sunshinehughes.workers.dev)

## Stack

- **Cloudflare Workers** (single Worker serves both the React SPA and the JSON API)
- **React 19 + Vite** for the client, built via `@cloudflare/vite-plugin`
- **Hono** for `/api/*` routes
- **D1** for catalog + orders (binding wired in Phase 1)
- **Tailwind CSS** + **Headless UI** + **Heroicons** for UI
- **Vitest** with `@cloudflare/vitest-pool-workers` (tests run inside workerd, the real runtime)

## Development

```sh
npm install
npm run dev          # vite dev server, Worker code runs in workerd via the plugin
npm test             # vitest run, against the real runtime
npm run typecheck    # tsc --noEmit
npm run build        # vite build → dist/
npm run deploy       # build + wrangler deploy
```

Local secrets go in `.dev.vars` (copy from `.dev.vars.example`, never commit). Production secrets go via `wrangler secret put`.

## Project documents

- [`docs/PRD.md`](docs/PRD.md) — product requirements
- [`docs/DESIGN.md`](docs/DESIGN.md) — UI/UX design brief
- [`docs/BUILDPLAN.md`](docs/BUILDPLAN.md) — phased build plan; the current phase is named at the top
- [`CLAUDE.md`](CLAUDE.md) — how to work on this codebase with Claude Code

## Course videos

🎥 **PRD video:** _(link after recording)_
🎥 **Demo video:** _(link after recording)_
