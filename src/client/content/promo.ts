/**
 * Launch-promo copy.
 *
 * $24.99 is the INTRODUCTORY price (the plan is to raise it later, ~$28), so the
 * framing is "get it at the launch price before it goes up" — NOT a discount off
 * a higher shown price. All shirts are a flat $24.99, which is why a single price
 * reads cleanly. Both promo surfaces — the site-wide <PromoBanner> and the Shop
 * page header — read from here so the wording stays in sync.
 */
export const promo = {
  price: "$24.99",
  /** Site-wide scrolling banner (PromoBanner). */
  bannerText:
    "Introductory launch pricing — every tee just $24.99 for a limited time",
  /** Shop page header note. */
  shopNote:
    "Introductory launch pricing — every tee is $24.99 for a limited time. Prices go up soon.",
} as const;
