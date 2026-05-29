# Product Requirements Document (PRD)

> **Status:** v1 in build — peer-reviewed 2026-05-29
> **Last updated:** 2026-05-29
> **Author:** Sunshine
> **Stakeholder:** Sunshine (founder, in recovery, drawing on personal and peer experience)

---

## 1. The problem

People in substance abuse recovery want apparel that reflects their journey, identity, and pride — but the existing market doesn't speak their language. Recovery-themed clothing tends to either lean on generic motivational slogans or use deep insider 12-step jargon that only resonates with old-timers. There's a gap in the middle: witty, relatable, milestone-aware phrases that feel like something an actual person in recovery would say.

The founder is in recovery and has personally hit this wall — searching for shirts that capture how she and her peers talk about the experience and not finding them. Peers have repeatedly told her "that should be on a shirt" in response to phrases she uses naturally, which is the organic signal that prompted this project.

The shirt is more than apparel: it's wearable hope. A 3.5-year-clean person wearing a milestone shirt at a meeting tells a newcomer, without saying a word, that long-term cleantime is possible.

---

## 2. The user

- **Primary user:** Adults in active recovery (AA, NA, anger management, or other programs), age 25–65, who have hit a meaningful milestone and want to mark or share it.
- **Their current workflow:** They search Amazon, Etsy, or Redbubble for recovery shirts, scroll through generic options, and either settle for something that's "close enough" or give up.
- **Their technical comfort:** Comfortable enough to buy on Instagram or TikTok. Not necessarily savvy beyond that — checkout needs to be frictionless.
- **What device will they use it on?** Phone, almost exclusively. Discovery happens on social media; purchase happens in the same session.

**The buying moment:** Either (a) they relate to a phrase the moment they see it on social media, or (b) they're approaching/celebrating a recovery milestone (30/60/90 days, 6 months, yearly anniversaries) and want to mark it.

---

## 3. What success looks like

- **Must-have outcome:** **10 sales in the first 30 days after launch.** This proves the audience exists, the phrases land, and the funnel from social → site → checkout works end-to-end.
- **Nice-to-have outcome:** Customers post photos of themselves wearing the shirts on social media (organic word-of-mouth).
- **Not a goal:** Building a community platform, blog, or content destination. This is a store, not a hub.

---

## 4. Core user stories

1. **[Must]** As a person in recovery, I want to find a shirt that reflects my milestone (e.g., 3.5 years clean) so that I can wear my pride publicly and show newcomers that long-term cleantime is possible.
2. **[Must]** As a customer, I want to choose a shirt color from the provided options and enter my clean time so that the shirt feels personally mine without having to design anything from scratch. _(v1 update, 2026-05-29: program selection was dropped after peer feedback — a program only matters when a phrase is program-specific, otherwise it holds no weight. It returns as a `/shop` category filter once the catalog passes ~10 designs. See §5 and DESIGN §2.)_
3. **[Must]** As a customer, I want to pay with CashApp, PayPal, Venmo, or a credit/debit card from my phone so that checkout feels as easy as any other mobile purchase.
4. **[Should]** As a customer, I want to see a preview of my customized shirt before I buy so that I'm confident the clean time and color look right.
5. **[Should]** As a customer, I want to receive an order confirmation and tracking info by email so that I know my order is being fulfilled.

---

## 5. Out of scope (v1)

Explicitly **not** building in v1:

- User accounts (guest checkout only)
- Blog or content marketing on the site
- Community forum or discussion features
- "Find your shirt" quiz or recommendation engine
- Subscription boxes or recurring shipments
- Bulk / wholesale orders for recovery centers
- Designs based on traditional 12-step slogans that require insider program knowledge to understand
- Customer-uploaded designs or full custom text beyond the clean-time field
- Program selection as a per-product customization choice (deferred per 2026-05-29 peer feedback — only meaningful when a phrase is program-specific). It returns as a `/shop` category filter — **Recovery / Healing / Motivation** — once the catalog passes ~10 designs.

---

## 6. Technical shape

- **Type of app:** Full-stack web app (mobile-first storefront)
- **Does it need to store data?** Yes — product catalog (designs, color options, phrase categories), order records, customization choices per order. No customer accounts.
- **Does it need authentication?** Admin only (founder, to manage catalog). No customer auth.
- **Does it need to call external services?** Yes — payment processors (Stripe, PayPal) and a dropship supplier API (TBD).
- **Who pays for hosting?** Founder. Cloudflare free tier should comfortably cover early traffic.

### Proposed Cloudflare stack

| Need | CF Product | Why |
|---|---|---|
| Hosting the web UI + backend logic | **Workers + Static Assets** | One Worker serves the React bundle as static assets and the `/api/*` routes via Hono. One name, one deploy. (`wrangler.toml`: `run_worker_first = ["/api/*"]`.) |
| Structured data (catalog, orders) | **D1** | SQL database for products, color/program options, order records |
| Shirt design images | **Cloudflare Images** | Stores and serves design previews; handles transformations |
| Form/bot protection | **Turnstile** | Protects checkout from bot abuse |
| Email (order confirmations) | **Email Service / external** | Transactional email for receipts and tracking |

**Payment integrations (external):**
- **Stripe** — credit/debit, Apple Pay, Google Pay, CashApp Pay
- **PayPal SDK** — PayPal and Venmo

---

## 7. Risks and unknowns

- **Biggest risk:** **Dropship supplier choice and API integration.** The supplier's capabilities determine whether per-order custom text (clean time numbers) is even possible, what margins look like, and how complex the integration is. *Mitigation: select supplier in week 1, before any storefront code is written.* **Update 2026-05-29: Printify and Printful accounts both created.** The "no supplier" risk is resolved; the open question is now which of the two to build the Phase 4 integration against (decision pending — both kept as a hedge).
- **Things I don't know how to do yet:**
  - Integrating a dropship API end-to-end
  - Wiring multiple payment processors (Stripe + PayPal) into one checkout
  - Building a mobile-first product customization UI with live preview
- **Things I'm assuming but haven't verified:**
  - Dropship suppliers will require a deposit/down payment (likely false — most use pay-per-order)
  - Custom text and images cost extra per item (varies by supplier)
  - Customers will buy a $25–35 shirt from an unknown brand on social media
  - All four payment methods (CashApp, PayPal, Venmo, card) can be embedded in one checkout flow. _Update 2026-05-29: Cash App Pay is enabled **through Stripe** (not a personal Cash App $cashtag); PayPal + Venmo run through the PayPal SDK and want a free **PayPal Business** account. Founder currently holds personal CashApp/PayPal — verify the combined flow and upgrade PayPal to Business in Phase 3._
- **Operational risk:** Single dropship supplier = single point of failure. *Mitigation: identify a backup supplier; display shipping-delay notices on-site during peak seasons.*

---

## 8. Milestones

A 3-week build plan. **Week 2 end must have something deployed and visible.**

- **Week 1 end (May 14):** Dropship supplier selected and account created. Payment processors selected. Cloudflare project scaffolded (Workers + Static Assets + D1; Images TBD). 3–5 starter shirt designs created (offline). _Actual: scaffold shipped; supplier + Stripe accounts created later (see 2026-05-29 update in §7)._
- **Week 2 end (May 21):** **Live deployed storefront** that lets visitors browse the catalog, customize a shirt (color, clean time), and see a preview. Checkout does not need to work yet. Link shared with at least 5 peers in recovery for feedback. _✅ Done — shipped + peer-reviewed 2026-05-29; feedback folded into the build plan as Phase 2.5._
- **Week 3 end (May 28):** Stripe + PayPal checkout wired up. Dropship API submits real orders. End-to-end test placed with founder's own address. Soft launch on social media.
- **Week 4 demo:** Walkthrough of a real customer journey — social media → site → customization → payment → order confirmation → dropship fulfillment notification.
