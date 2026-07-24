# vv-styles

Recovery-apparel storefront — shirts in the real language of recovery, made by someone in recovery. **vv** = *Very Vocal*. A venture of **Esoh Creations LLC**.

🔗 **Live site:** [https://vv-styles.com](https://vv-styles.com)
🔗 **Backup URL:** [https://vvs-styles.sunshinehughes.workers.dev](https://vvs-styles.sunshinehughes.workers.dev)

> Note: the Cloudflare Worker and D1 database are still named `vvs-styles` (infra names — renaming them changes the URL / is destructive). The customer-facing brand is **vv-styles**.

## Stack

- **Cloudflare Workers** (single Worker serves both the React SPA and the JSON API)
- **React 19 + Vite** for the client, built via `@cloudflare/vite-plugin`
- **Hono** for `/api/*` routes
- **D1** for catalog + orders
- **Stripe** for checkout (Payment Element: card / Cash App / Apple / Google Pay)
- **Printify** for print-on-demand fulfillment; **Resend** for transactional email
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

Local secrets go in `.dev.vars` (copy from `.dev.vars.example`, never commit). Production secrets go via `wrangler secret put`. **Keep local dev on Stripe *test* keys** (`.dev.vars` holds `pk_test`/`sk_test`); production uses the live pair (`pk_live` in `wrangler.toml`, `sk_live` via `wrangler secret`).

## Deploying

```sh
npm run build                                              # REQUIRED first — regenerates dist/vvs_styles/wrangler.json
wrangler deploy
# Re-apply seeds to remote D1 when the catalog changes (in this order):
wrangler d1 execute vvs-styles --remote --file=seeds/shirts.sql
wrangler d1 execute vvs-styles --remote --file=seeds/shirt_options.sql
wrangler d1 execute vvs-styles --remote --file=seeds/shirt_variants.sql
```

Gotchas learned the hard way:
- **`npm run build` before every deploy.** The vite plugin generates `dist/vvs_styles/wrangler.json`; edits to `wrangler.toml` do nothing until a rebuild.
- **Keep `workers_dev = true`** in `wrangler.toml`. Adding custom-domain `[[routes]]` otherwise disables the `*.workers.dev` URL (404s the whole site).
- **Custom domain:** delete any conflicting A/AAAA/CNAME records for the hostname *first*, then deploy (Stripe/DNS error `100117` = "externally managed DNS records"). Keep MX/TXT (email).
- **Stripe keys are a matched pair** — publishable and secret must both be `test` or both `live`. Quick audit: `grep -hoE '(sk|pk)_(test|live)' .dev.vars wrangler.toml | sort | uniq -c`.

## Launch checklist

Done:
- [x] Deployed to `vv-styles.com` (custom domain, SSL) + workers.dev backup
- [x] Catalog live — 10 shirts, per-color photos, 6 colors each
- [x] Stripe **live** payments — verified with a real end-to-end order
- [x] Order confirmation + founder-alert emails (Resend), verified sender domain
- [x] Hybrid fulfillment — plain shirts auto-submit to Printify; personalized route to manual
- [x] About + FAQ pages; returns policy (defects/wrong-item) in the FAQ
- [x] Footer socials (Instagram / Facebook / TikTok) + Esoh Creations LLC
- [x] Introductory launch-pricing promo (site banner + shop header)

Remaining:
- [ ] Logos (Esoh Creations + vv-styles) — wire into Nav/Footer once designed
- [ ] Accessibility audit (axe-core) — zero violations across routes
- [ ] Lighthouse mobile ≥ 90 in all four categories
- [ ] Soft-launch post to social
- [ ] Course videos (below)

## Project documents

- [`docs/PRD.md`](docs/PRD.md) — product requirements
- [`docs/DESIGN.md`](docs/DESIGN.md) — UI/UX design brief
- [`docs/BUILDPLAN.md`](docs/BUILDPLAN.md) — phased build plan; the current phase is named at the top
- [`CLAUDE.md`](CLAUDE.md) — how to work on this codebase with Claude Code

## Course videos

🎥 **PRD video:** _(link after recording)_
🎥 **Demo video:** _(link after recording)_
