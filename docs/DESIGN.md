# Design Brief

_This file is the source of truth for UI/UX decisions on this project. Fill it out with the `design-brief` skill after the PRD is solid. Keep it short — a design brief is a compass, not a spec._

## 1. Visual identity

**Mood (3–5 adjectives):** Inviting, easy-going, open-minded. The store should feel welcoming and low-pressure — recovery-as-"come-as-you-are", not recovery-as-rebellion. Warm and approachable, never clinical or edgy.

**Reference apps:**
- **Bath & Body Works** — borrowing the typography (friendly, rounded sans-serif) and the photo style (clean, bright, warm-lit product shots that feel approachable, not high-fashion).
- **Pandora** — borrowing the typography (warm serifs for display + clean sans for body) and the photo style (lifestyle shots that feel down-to-earth). Also a useful parallel for the customization flow, since Pandora is built around "build your own" charm bracelets and vvs-styles is built around "build your own" milestone shirts.

The common thread is **warm, approachable, down-to-earth** — not editorial fashion, not Apple-store minimalism.

**Borrow with one adjustment:** keep B&BW/Pandora's typography and photo style, but use a **gender-neutral palette** (warm earth tones, soft greens, creams, navy) instead of their feminine palettes (peach, rose gold, blush). The audience is adults in recovery of all genders; the store should feel equally welcoming to a man and a woman.

**Anti-references:**
- **Temu / SHEIN** — cluttered, gaudy, busy, scream low quality. Avoid: stacked promo banners, neon callouts, dense grids with too many products per row, flashing animations.
- **Typical 12-step store / dusty old bookstore site** — sterile, dated, boring, off-putting to newcomers. Avoid: stock recovery imagery, 2003-era page layouts, heavy serif body copy, generic Christian-bookstore palettes.
- **High-fashion brands** — expensive-feeling, exclusionary, "only for the rich". Avoid: ultra-thin all-caps serifs, slow cinematic intros, hiding prices, model-only photography with no product detail.

The common thread of all three: **never make a person in recovery feel like the store isn't for them** — whether because it feels cheap, dated, or out-of-reach.

**Brand constraints:** None. Fresh greenfield project — no existing logo, colors, fonts, social presence, or prior stakeholder commitments. We have full freedom on visual identity.

## 2. Information architecture

**Primary screens (top-level routes):**
- `/` — **Landing.** Hero, brand promise, featured shirts, entry point to shop.
- `/shop` — **Product catalog.** All available shirts; mobile-friendly grid; filter by **phrase category (Recovery, Healing, Motivation)** once the catalog passes ~10 designs. _(Was "filter by program"; changed 2026-05-29 per peer feedback — see §7.)_
- `/product/:slug` — **Product detail + customization.** Single shirt with the customization flow: shirt color picker (v1 = six basics: white, black, gray, red, pink, blue), size, clean-time input, live-ish preview, add-to-cart. _(Program selector dropped in v1 — peer feedback: a program only matters when the phrase is program-specific.)_
- `/cart` — **Cart review.** Line items, quantities, subtotal, "checkout" button. On mobile, a slide-over drawer triggered from the nav is the everyday access pattern; the `/cart` route is the dedicated review page.
- `/checkout` — **Payment.** CashApp / PayPal / Venmo / card. Shipping address. Order summary.
- `/order/confirmation` — **Thank-you.** Order number, what to expect, optional "share your shirt" prompt for the social loop.
- `/about` — **Founder story.** The recovery context that gives this store its meaning. Linked from footer + secondary nav slot, not competing with "Shop" for top billing.
- `/faq` — **Sizing, shipping, returns, customization questions.** Footer-linked content page.

**Navigation model:** Fixed top bar, mobile-first.

- **Left:** logo (also home link).
- **Right (mobile):** cart icon (with item count) + hamburger.
- **Right (desktop, `md:` and up):** inline links — `Shop`, `About`, `FAQ` — plus cart icon. Hamburger hidden.
- **Hamburger drawer (mobile only):** Headless UI `Dialog` panel sliding in from the right. Contains `Shop`, `About`, `FAQ`, and footer copy (small).
- **Cart drawer (all sizes):** Headless UI `Dialog` panel sliding in from the right, triggered by the cart icon. Shows line items + a "view cart" link to the full `/cart` page.

Footer is shared across all routes and includes `About`, `FAQ`, social links, copyright, and any legal pages. The footer is where `/about` and `/faq` get most of their traffic — the top nav surfaces them only on desktop.

**The hero screen:** `/` (the landing page).

**The 3-second message: legitimacy.** People in recovery are skeptical of everything early on, and the brand has to read as real, insider-made, and trustworthy before anything else. Identity ("this is for me") and desire ("I want this shirt") come *after* legitimacy lands.

**Hero composition:**
- **Photo:** A real person wearing a shirt, **face cropped or otherwise hidden**. The anonymity is intentional — it nods to 12-step tradition, avoids stock-photo tells, and lets the viewer project themselves onto the model. Photography style is warm, natural light, real environment (not a white-cyc studio). Borrowed feel from Bath & Body Works / Pandora lifestyle photography, but down-to-earth, never glossy.
- **Shirt text shown in the photo should be one of the strongest "that should be on a shirt" insider phrases.** The phrase itself is the legitimacy proof — a visitor reads it and recognizes language only an insider would use.
- **Prices visible from the hero**, not behind a "shop" click. No hidden pricing.
- **One short credibility line near the hero**, e.g. _"Made in recovery, for people in recovery."_ Exact wording TBD; pairs with the `/about` page for the full story.
- **One primary CTA**: "Shop the collection" → `/shop`. No competing buttons.

## 3. Component approach

- **Framework:** React.
- **Component library:** [Headless UI](https://headlessui.com/) for unstyled, accessible primitives.
- **Styling:** Tailwind CSS.
- **Icons:** [Heroicons](https://heroicons.com/) — same team as Tailwind/Headless UI, one less decision.
- **Component library beyond Headless UI:** None for v1. Decided against adding shadcn/ui because (a) it's another tool to learn while learning the basics, and (b) shadcn's default modern-neutral look fights our warm B&BW/Pandora-inspired direction, so its theming overhead would cancel out its time savings on a store this size.

**Headless UI primitives we'll actually use:**
- `Dialog` — mobile nav drawer; cart drawer.
- `RadioGroup` — color picker on product page. _(Program selector dropped in v1; phrase-category filtering returns to `/shop` as a `Combobox`/filter once the catalog passes ~10 designs.)_
- `Listbox` — size selector on product page.
- `Disclosure` — FAQ accordion items.
- `Combobox` — only if `/shop` grows enough to need search.

**Custom components (built ourselves):**
- Product image viewer with pinch-zoom on mobile. Start simple (just a tap-to-zoom modal using `Dialog`); reach for [yet-another-react-lightbox](https://yet-another-react-lightbox.com/) only if needed.
- The customization preview that renders the chosen color + clean-time on a shirt mockup. **v1 direction (2026-05-29):** use a **real product image** from the print provider's mockup as the base (replacing the placeholder colored panel Phase 2 shipped), with clean-time overlaid as text; some designs also carry a **small accompanying graphic** that complements the phrase. Keep the overlaid-`<span>` approach for clean-time; only reach for SVG/canvas if it looks janky over a real photo.
- Reusable `<Button>` wrapper to keep button styling consistent across the app from day one.

**Why this stack:** Headless UI gives accessibility (focus management, ARIA, keyboard nav) for free; Tailwind makes the styling decisions explicit in markup. Together they let an AI-assisted developer move fast without shipping inaccessible junk.

## 4. Visual tokens

Pick a small palette and stick to it. Don't try to design a full design system — pick enough to be consistent.

- **Color:**
  - **Primary:** `#166534` (Tailwind `emerald-800`) — deep forest. The "everything important" color: primary buttons, headings, brand mark, focus rings. Calm, grounded, reads as growth without being literal about it.
  - **Neutrals:** Tailwind `stone` palette (warm grays, not the cooler `slate` or `gray`).
    - `stone-50` `#FAFAF9` — page backgrounds, cream washes.
    - `stone-200` `#E7E5E4` — card borders, dividers.
    - `stone-500` `#78716C` — secondary text.
    - `stone-700` `#44403C` — body text on light backgrounds.
    - `stone-900` `#1C1917` — only for highest-contrast moments (rare).
  - **Accent:** `#C2410C` (Tailwind `orange-700`) — terracotta. Used sparingly: sale tags, "new" badges, occasional CTA emphasis. Never compete with primary for attention.
  - **Semantic:**
    - Success: `#15803D` (emerald-700) — close enough to primary to feel cohesive.
    - Warning: `#B45309` (amber-700).
    - Danger: `#B91C1C` (red-700).
  - Color is **never the only way** to convey information (also use icons, labels, or text).
- **Type:**
  - **Display / headings:** [Fraunces](https://fonts.google.com/specimen/Fraunces) — warm variable serif. Used for h1, h2, hero copy, product titles. Borrows the Pandora-display feeling without going feminine.
  - **Body / UI:** [Inter](https://fonts.google.com/specimen/Inter) — workhorse sans-serif. Used for body copy, button labels, form labels, prices, navigation, anything functional.
  - Both are free Google Fonts.
  - **Sizes (Tailwind utilities):**
    - `text-xs` (12px) — captions, fine print.
    - `text-sm` (14px) — secondary body, form helper text.
    - `text-base` (16px) — default body.
    - `text-lg` (18px) — emphasized body.
    - `text-2xl` (24px) — h3, product titles.
    - `text-3xl` (30px) — h2, section headers.
    - `text-5xl` (48px) — h1, hero headline. Use Fraunces here.
  - **Hierarchy rule:** headings are Fraunces, everything else is Inter. Don't mix the two within a single piece of UI (e.g. don't put a Fraunces word inside an Inter sentence for "emphasis" — use weight instead).
- **Spacing scale:** Tailwind defaults (4px base unit). Don't invent custom spacing values.
- **Radius:** `rounded-md` (6px) everywhere — buttons, inputs, cards, modals, images. One value, applied consistently. The exception is icon buttons (`rounded-full`) where the pill is the established convention.
- **Shadow:** Used sparingly. Two elevations only:
  - `shadow-sm` — subtle lift on product cards (`/shop` grid).
  - `shadow-lg` — modals, drawers, sticky cart preview.
  - Do not use `shadow-md`, `shadow-xl`, or custom shadows.

## 5. Accessibility floor

The non-negotiables for this project. All five are committed for v1 — built in from day one, not retrofitted.

- **Keyboard navigable end-to-end.** Every interactive element reachable with Tab and operable with Enter/Space/Escape. No mouse required to complete a purchase.
- **WCAG AA color contrast on all text.** Body text 4.5:1, large headings 3:1. Deep forest (`#166534`) on cream (`#FAFAF9`) and white on deep forest both pass; verify any new color pairing against [WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/) before shipping it.
- **Visible labels on every form input.** Placeholder text is never a label. Every input gets a real `<label>`, even if it's visually compact.
- **Visible focus states.** Never `outline: none` without an explicit replacement ring (Tailwind's `focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2` is the default pattern).
- **Color is never the only signal.** Success / warning / error always carry an icon or text label in addition to color. A red border alone is not enough.

**Why this matters for vvs-styles specifically:** the brief commits to *"never make a person in recovery feel like the store isn't for them."* Failing accessibility breaks that promise for any customer with a screen reader, low vision, a motor impairment, or older eyes. Accessibility here is a brand extension, not just a technical floor.

## 6. Responsive strategy

- **Breakpoints:** Tailwind defaults — `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. No custom breakpoints.
- **Smallest target:** **Phone (375px wide, iPhone SE).** Phone-first, design from small upward.
- **Default-up approach:** Tailwind classes without a prefix apply on phone. `md:` / `lg:` prefixes scale layouts up. Never `desktop-down`.
- **What changes at each breakpoint:**
  - **Phone (default):** Single column everywhere. Top nav = logo + hamburger + cart icon. `/shop` grid = 2 columns. `/product/:slug` stacks vertically. Footer in a single column.
  - **`md:` (≥768px, tablet portrait):** Top nav switches to inline links + cart icon (hamburger hidden). `/shop` grid → 3 columns. Footer → 2–4 column grid.
  - **`lg:` (≥1024px, laptop):** `/product/:slug` switches to a two-column layout — photo on the left, customization controls on the right (photo sticky so it stays visible while the controls scroll). `/shop` grid → 4 columns.
  - **`xl:` (≥1280px, large desktop):** Container max-width caps so content doesn't sprawl across a 27" monitor; mostly the same layout as `lg`.

## 7. Risks & unknowns

- **Customization preview — #1 design risk.** "Show the customer their chosen color + clean time on a shirt mockup before they buy" can be done as an SVG overlay, layered images, or a canvas render. None is obvious-best. If the preview looks janky or slow, customers will abandon the customization flow. Plan to prototype the simplest version first (layered images with the clean-time as an overlaid `<span>`) and only level up if needed. _Update 2026-05-29: Phase 2 shipped the placeholder (a colored panel + overlaid text). Peers confirmed the layout works but want a **real t-shirt image** — the v1 polish pass swaps the colored panel for real product mockups from the chosen print provider._
- **Hero photography is a hard dependency.** The legitimacy strategy in section 2 only works if we have real, faceless lifestyle photos of people wearing shirts with strong insider phrases. Stock photos break the strategy. Need a plan (shoot ourselves? trade shirts to peers in exchange for photos?) before launch.
- **"Strongest insider phrases" aren't catalogued yet.** The PRD names the "that should be on a shirt" signal but doesn't list which specific phrases. The hero shirt's phrase is critical — it's the legitimacy proof. Need to gather 10–20 candidate phrases and pick the strongest one for the hero before designing the hero in detail. _Update 2026-05-29: founder now has real phrases to seed the database, replacing the mocks. v1 launches with **fewer than 8 designs**, adding more based on launch performance._
- **Mobile payment flow.** Integration is a separate engineering problem, but the visual flow through CashApp / Venmo / PayPal / card in one mobile session has to be tight or people bail. Design risk: each provider has its own redirect/sheet behavior, which can break the visual continuity of the checkout.

## 8. Out of scope (for v1)

Same spirit as the PRD's out-of-scope section but for design. The goal of v1 is 10 sales in 30 days — anything that doesn't move that needle is deferred.

- **Dark mode.** Light theme only. Adds complexity to every color decision; not a known buyer expectation for an apparel store. Revisit if customer feedback asks for it.
- **Custom animations / motion design.** Only the default Headless UI transitions (smooth open/close for drawers and dialogs). No Framer Motion, no scroll animations, no hover micro-interactions beyond Tailwind's defaults.
- **A commissioned logo or custom illustration system.** The v1 *site* "logo" is the wordmark "vvs-styles" set in Fraunces in deep forest (`#166534`). A commissioned logo and any illustration system come after revenue exists to fund them. _Update 2026-05-29: peers flagged that the physical product needs a brand mark (e.g. inside-neck-tag label). In scope for v1: a **simple brand mark** (the wordmark is fine) applied to the product via the print provider's branding/neck-label feature — set up during Phase 4. A fully designed/illustrated logo system stays deferred._
- **Internationalization / non-English layouts.** English only. No translation framework, no RTL layouts, no currency switching. US-only checkout for v1.
