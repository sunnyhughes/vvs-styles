# Build Plan

_This file is the phased build plan for the project. It's the bridge between `docs/PRD.md` (what to build) + `docs/DESIGN.md` (what it looks like) and the actual code. Fill it out with the `build-plan` skill after the PRD and design brief are stable. Re-run the skill whenever reality has diverged from the plan._

> **Status:** Draft
> **Last updated:** 2026-05-13
> **Current phase:** Phase 0 (not started)

---

## Why a build plan exists

Claude Code sessions have a finite context window. The cheaper a session is to start, the better the work tends to be. A good build plan slices the project into phases where each phase:

- Has a single user-visible outcome.
- Touches a bounded set of files.
- Names exactly which docs and files Claude should load to execute it.
- Leaves the repo in a clean, testable state at the end.

That way each phase fits in a focused session — no full-repo loads, no thrashing, no context exhaustion mid-implementation.

---

## Strategy

- **Slicing principle:** **Vertical slices by user story.** Each phase ships one user-visible outcome end-to-end (D1 + Worker + UI for that story). Chosen because the PRD's Week 2 milestone requires a live, shareable storefront, and the riskiest unknowns are UI-level (customization preview, mobile checkout flow).
- **Critical path:**
  1. **Phase 0 (scaffold)** unblocks everything — no other phase can start until a Cloudflare Worker + Pages + D1 project is bootstrapped, deployed, and smoke-tested.
  2. **Phase 2 (customize + add to cart)** is the hardest UI risk and the milestone gate for Week 2. Hitting Phase 2 end means we have something to share with peers in recovery for feedback before spending Week 3 on payment integration.
- **What was deferred to later phases on purpose:**
  - **Payment integration** is its own phase (Phase 3) — keeping the Week 2 build payment-free is intentional. Peers can give feedback on the *experience* without us first having to wire Stripe + PayPal.
  - **Dropship API integration** is Phase 4. Until peers confirm the product feel is right, there's no point wiring a real supplier.
  - **About / FAQ / accessibility polish** is Phase 5. Content pages don't move the funnel — they're a launch-readiness task, not a discovery task.
- **Phase boundaries are `/clear` boundaries.** Run `/clear` between phases. Each phase's "Context to load" line below names exactly what to load on a fresh session — never load the whole repo.

---

## Phases

Each phase below follows the same structure. Skip what doesn't apply but keep the headers so future-you (or future-Claude) can scan.

### Phase 0 — Scaffolding

**Goal:** A blank Cloudflare project (Worker + Pages + D1 binding) is bootstrapped with React, Tailwind, Hono, and Vitest. Deployed to a public URL that serves the "vvs-styles" wordmark on a styled blank page. Smoke test green.

**Context to load:** `CLAUDE.md`, `docs/PRD.md` §6 (technical shape), `docs/DESIGN.md` §3 (component approach) and §4 (visual tokens — for Tailwind config).

**Files this phase creates/modifies:**
- `package.json` — deps: `hono`, `react`, `react-dom`, `react-router-dom`, `@headlessui/react`, `@heroicons/react`, `tailwindcss`, `postcss`, `autoprefixer`. Dev deps: `vitest`, `@cloudflare/vitest-pool-workers`, `@cloudflare/workers-types`, `wrangler`, `vite`, `typescript`.
- `wrangler.toml` — worker name `vvs-styles`, `compatibility_date`, D1 binding placeholder, assets binding for static React build.
- `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`.
- `src/worker/index.ts` — Hono app with a single route serving the React shell.
- `src/client/main.tsx`, `src/client/App.tsx` — React entry + router scaffold with a Landing placeholder.
- `src/client/styles.css` — Tailwind directives + Google Fonts import (Fraunces + Inter).
- `src/client/components/Button.tsx` — the reusable `<Button>` component from DESIGN §3.
- `tests/smoke.test.ts` — Worker responds 200 on `/` with HTML containing "vvs-styles".
- `vitest.config.ts`, `.dev.vars.example`.
- Update `README.md` with the deployed URL.

**Tests this phase adds:** One smoke test — Worker responds 200, HTML contains "vvs-styles".

**Done-when:**
- [ ] `npm test` passes.
- [ ] `wrangler deploy` produces a public URL.
- [ ] Visiting the URL shows the "vvs-styles" wordmark in Fraunces, deep-forest color, on a cream background.
- [ ] URL is committed in `README.md`.

**Session budget:** 1–2 sessions.

**Risks / unknowns:**
- Cloudflare's Worker-serves-React-app pattern has shifted recently (Pages Functions vs Workers Assets binding vs Vite plugin). Decide once and document.
- D1 binding can be a placeholder this phase — no schema needed yet.

---

### Phase 1 — Visitor can browse the shop

**Goal:** A real person can land on the public URL on their phone, see a hero section, and navigate to `/shop` to see 3–5 shirts in a grid.

**Context to load:** `docs/PRD.md` §4 story 1, §5 (out-of-scope reminder), `docs/DESIGN.md` §1, §2 (IA + hero), §4 (visual tokens), §6 (responsive). Files from Phase 0.

**Files this phase creates/modifies:**
- `migrations/0001_init.sql` — D1 schema: `shirts` (id, slug, name, base_price_cents, default_image_url, hero_phrase).
- `seeds/shirts.sql` — 3–5 starter shirts with placeholder imagery.
- `src/worker/routes/shirts.ts` — `GET /api/shirts` returns the catalog.
- `src/client/pages/Landing.tsx` — hero (photo placeholder + headline + credibility line + CTA).
- `src/client/pages/Shop.tsx` — product grid (2 cols mobile, 3 cols `md:`, 4 cols `lg:`).
- `src/client/components/Hero.tsx`, `src/client/components/ShirtCard.tsx`.
- `src/client/components/Nav.tsx`, `src/client/components/MobileNavDrawer.tsx` (Headless UI `Dialog`), `src/client/components/Footer.tsx`.
- `src/client/lib/api.ts` — typed `fetch` wrapper for `/api/*`.

**Tests this phase adds:**
- `tests/api/shirts.test.ts` — `GET /api/shirts` returns 200 with array.
- `tests/components/ShirtCard.test.tsx` — renders fixture; price shows; `<a>` to product page.
- `tests/components/Nav.test.tsx` — hamburger opens drawer on mobile width; keyboard-navigable.

**Done-when:**
- [ ] Visiting the public URL on a phone shows a hero and a "Shop the collection" CTA.
- [ ] `/shop` shows 3–5 seeded shirts in a responsive grid.
- [ ] Top nav works: mobile = hamburger drawer; desktop = inline links.
- [ ] All tests pass.
- [ ] Keyboard-only navigation works from hero CTA through to shop grid.

**Session budget:** 2 sessions (substantial UI work).

**Risks / unknowns:**
- Hero photography is a hard dependency from DESIGN §7. Use a clearly-labeled placeholder for now and add a TODO; do not let "no real photo" block this phase.
- Insider-phrase catalog doesn't exist yet. Use 3–5 plausible mock phrases as seed data; flag for replacement later.

---

### Phase 2 — Visitor can customize a shirt and add it to a cart  ★ Week 2 milestone gate ★

**Goal:** A visitor can land on a product page, choose a program (AA / NA / anger management), pick a color, enter clean time, see the preview update, and add the customized shirt to a persistent cart. End state = something shareable with 5 peers for feedback.

**Context to load:** `docs/PRD.md` §4 stories 2 and 4, §8 (Week 2 milestone). `docs/DESIGN.md` §2 (product detail screen), §3 (`RadioGroup`, `Listbox`, custom preview), §6 (`lg:` two-column layout), §7 (customization preview = risk #1). Files from Phase 1.

**Files this phase creates/modifies:**
- `migrations/0002_shirt_options.sql` — `colors`, `programs`, `shirt_colors`, `shirt_programs` tables.
- `seeds/shirt_options.sql` — each shirt gets 3 color options + 3 programs.
- `src/worker/routes/shirts.ts` — extend with `GET /api/shirts/:slug` returning shirt + options.
- `src/client/pages/Product.tsx` — full product detail page (`lg:` 2-col split, mobile stacked).
- `src/client/components/ProgramSelector.tsx` (Headless UI `RadioGroup`).
- `src/client/components/ColorPicker.tsx` (Headless UI `RadioGroup` with swatches).
- `src/client/components/SizeSelector.tsx` (Headless UI `Listbox`).
- `src/client/components/CleanTimeInput.tsx` — labeled numeric input with helper text.
- `src/client/components/ShirtPreview.tsx` — layered-image preview with clean-time as an overlaid `<span>` (simplest approach per DESIGN §7).
- `src/client/components/AddToCartButton.tsx`.
- `src/client/components/CartDrawer.tsx` (Headless UI `Dialog` panel from the right).
- `src/client/pages/Cart.tsx` — `/cart` route.
- `src/client/lib/cart.ts` — cart state, `localStorage`-backed.

**Tests this phase adds:**
- `tests/api/shirts.test.ts` — extend: `GET /api/shirts/:slug` returns shirt with options.
- `tests/components/ProgramSelector.test.tsx`, `ColorPicker.test.tsx`, `CleanTimeInput.test.tsx` — render + select + keyboard.
- `tests/lib/cart.test.ts` — add, remove, update qty, persists across reload.
- `tests/components/CartDrawer.test.tsx` — opens on add, closes on Escape, focus trap works.

**Done-when:**
- [ ] Visitor lands on `/product/:slug` and sees program/color/clean-time/size controls.
- [ ] Selecting an option updates the preview live.
- [ ] "Add to cart" opens the cart drawer with the line item.
- [ ] `/cart` shows the line item; quantity can be adjusted; total updates.
- [ ] Cart state survives a full page reload.
- [ ] All tests pass.
- [ ] **Public URL shared with 5 peers in recovery for feedback** (PRD §8 Week 2 milestone).

**Session budget:** 2 sessions.

**Risks / unknowns:**
- Customization preview is the #1 design risk (DESIGN §7). If layered images look janky, escalate to SVG overlay before reaching for canvas. Do not let "perfect preview" block the milestone.
- Mobile keyboard behavior on `CleanTimeInput` — test on a real phone, not just DevTools.
- Insider-phrase catalog still pending; seed with mocks.

---

### Phase 3 — Visitor can check out and pay

**Goal:** A real person can pay for a shirt using card (Stripe), CashApp Pay (via Stripe), PayPal, or Venmo (both via PayPal SDK). Order is persisted in D1.

**Context to load:** `docs/PRD.md` §4 story 3, §6 (payment integrations), §7 (assumptions about all four methods working). `docs/DESIGN.md` §2 (checkout screen), §7 (mobile payment flow risk). Files from Phase 2.

**Files this phase creates/modifies:**
- `migrations/0003_orders.sql` — `orders` table (no customer accounts; captures shipping address + email per order), `order_items` table.
- `src/worker/routes/checkout.ts` — Stripe Payment Intent creation; PayPal order creation.
- `src/worker/routes/orders.ts` — `POST /api/orders` after payment success.
- `src/client/pages/Checkout.tsx` — page UI: shipping form + payment method picker + order summary.
- `src/client/components/ShippingForm.tsx`.
- `src/client/components/PaymentMethodPicker.tsx` (Headless UI `RadioGroup`).
- `src/client/components/StripeCheckout.tsx` — Stripe Elements integration.
- `src/client/components/PayPalCheckout.tsx` — PayPal SDK integration.
- `src/client/pages/OrderConfirmation.tsx` — `/order/confirmation/:id` (basic confirmation; email comes in Phase 4).
- `.dev.vars.example` — add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`.
- Set production secrets via `wrangler secret put`.

**Tests this phase adds:**
- `tests/api/checkout.test.ts` — Payment Intent creation (mocked Stripe).
- `tests/api/orders.test.ts` — `POST /api/orders` creates order on payment success; rejects on failure.
- Manual E2E: founder places a real test order via card + sandbox PayPal.

**Done-when:**
- [ ] Visitor completes a card payment (real test card) and is redirected to confirmation page.
- [ ] Visitor completes a PayPal sandbox payment.
- [ ] Order row exists in D1 with line items, shipping address, and payment reference.
- [ ] All automated tests pass.
- [ ] Stripe + PayPal production secrets configured (sandbox until launch).

**Session budget:** 2+ sessions (payment integrations are fiddly).

**Risks / unknowns:**
- Stripe and PayPal both require account creation up front — block on this if accounts don't exist.
- CashApp Pay availability via Stripe varies by region — verify before promising it in UI.
- Each payment provider's mobile sheet has different return behavior — test on a real phone, not just desktop.
- PRD §7 calls out a possibly-false assumption that all four methods can be embedded in one checkout — verify Venmo via PayPal SDK works in our integration shape.

---

### Phase 4 — Order routing + confirmation email

**Goal:** When a customer pays, the order is submitted to the dropship supplier and the customer receives a confirmation email with order number and what to expect.

**Context to load:** `docs/PRD.md` §4 story 5, §6 (dropship supplier table row, email row), §7 (dropship is the #1 PRD risk). Files from Phase 3.

**Files this phase creates/modifies:**
- `src/worker/integrations/dropship.ts` — API client for the selected supplier.
- `src/worker/integrations/email.ts` — transactional email sender (Resend or similar HTTP-based service; Workers don't support SMTP natively).
- `src/worker/routes/orders.ts` — extend: on payment success, submit to dropship + send confirmation email.
- `src/worker/templates/order-confirmation.html` — email template.
- `migrations/0004_order_tracking.sql` — `submitted_to_dropship_at`, `dropship_order_id`, `tracking_url`, `status` columns.
- `wrangler.toml` updated with email service binding if used.
- Secrets via `wrangler secret put`: `DROPSHIP_API_KEY`, `EMAIL_API_KEY`.

**Tests this phase adds:**
- `tests/worker/dropship.test.ts` — mocked dropship submission.
- `tests/worker/email.test.ts` — mocked email send; correct template substitution.

**Done-when:**
- [ ] After payment success, the order is submitted to the dropship API and the supplier's order ID is stored.
- [ ] Customer receives a confirmation email with order number, expected timeline, and a contact line.
- [ ] Founder places one full end-to-end real test order using own address and confirms the entire chain works.
- [ ] All automated tests pass.

**Session budget:** 2 sessions.

**Risks / unknowns:**
- **Phase 4 is blocked until the dropship supplier is selected** (PRD §7 #1 risk; PRD §8 Week 1 milestone). If supplier still isn't chosen, do not start this phase.
- Email deliverability — sender domain authentication (SPF/DKIM/DMARC) must be set up before email service goes live.

---

### Phase 5 — About, FAQ, accessibility audit, launch polish

**Goal:** The site is ready for soft launch. Content pages exist, automated accessibility audit is green, performance is acceptable on a mid-range phone, and the README has the public URL + launch checklist.

**Context to load:** `docs/DESIGN.md` §2 (about + FAQ screens), §5 (accessibility floor). Files from prior phases (audit-only).

**Files this phase creates/modifies:**
- `src/client/pages/About.tsx` — founder story.
- `src/client/pages/FAQ.tsx` — Headless UI `Disclosure` accordion (sizing, shipping, returns, customization).
- `src/client/content/about.ts`, `src/client/content/faq.ts` — extracted copy.
- Fixes surfaced by the a11y audit (case-by-case).
- `README.md` — final public URL, demo video link, PRD video link, launch checklist.
- Optional: regenerate the architecture diagram via the `architecture-diagram` skill.

**Tests this phase adds:**
- `tests/a11y.test.tsx` — axe-core audit on each top-level route.
- Manual Lighthouse mobile run on a real phone.

**Done-when:**
- [ ] `/about` and `/faq` pages exist with real copy (placeholder copy OK if real not ready, but flag).
- [ ] axe-core audit reports zero violations across all routes.
- [ ] Lighthouse mobile score ≥ 90 in all four categories.
- [ ] README has public URL, demo video, PRD video, launch checklist.
- [ ] Soft launch posted to social.

**Session budget:** 1 session.

**Risks / unknowns:**
- Performance issues often surface in this phase — image sizes are the usual culprit. Don't fight Lighthouse to 100; 90+ is the bar.
- Third-party components (Stripe Elements, PayPal SDK) may have a11y warnings we can't fix. Document and move on.

---

## Decision log

A short append-only log of when the plan changed and why. Helps future-you understand why the current phase numbering exists.

| Date | Phase touched | Change | Reason |
|---|---|---|---|
| 2026-05-13 | All | Initial plan written | First time through `build-plan` skill after PRD + DESIGN brief locked. |

---

## Handoff notes

_What state should the repo be in when this plan is "done"? Used to verify the project shipped._

- Public URL deployed and linked from README.
- All Must-have user stories from PRD.md §4 have green tests.
- Architecture diagram regenerated and committed.
- Demo video and PRD video linked from README.
