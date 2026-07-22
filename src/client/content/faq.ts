/**
 * FAQ copy for vv-styles.
 *
 * FIRST-PASS DRAFT (2026-07-08), aligned with the launch decisions:
 * - Shipping: FREE, baked into the $24.99 price.
 * - Returns: defects / wrong-item only (made-to-order + personalized items).
 * - Payments (live at launch, via Stripe): card, Cash App Pay, Apple Pay,
 *   Google Pay. PayPal + Venmo are marked "coming soon" until Phase 3.5 wires
 *   the PayPal SDK — do NOT claim them as live before that ships.
 *
 * TODO before soft launch:
 * - Add a per-product size chart, then tighten the sizing answer.
 * - When Phase 3.5 ships, drop the "coming soon" clause from the payments answer.
 */

/**
 * Support address, shared across every Esoh Creations venture for now.
 * Swap to a branded vv-styles.com mailbox once that domain's MX records are
 * live; it is referenced from several answers below, so change it here only.
 */
export const CONTACT_EMAIL = "esohcreationsllc@gmail.com";

export type FaqItem = { q: string; a: string[] };

export const faqItems: FaqItem[] = [
  {
    q: "How do the sizes run?",
    a: [
      "Our shirts are printed on a classic unisex fit that runs true to size for most people. If you're between sizes or like a roomier feel, size up.",
      `Because every shirt is made to order, we can't swap sizes after printing — so if you're unsure, email us at ${CONTACT_EMAIL} before you order and we'll help you land on the right one.`,
    ],
  },
  {
    q: "When will my order arrive?",
    a: [
      "Every shirt is printed just for you, so give it about 5–7 business days to print, plus a few days to ship. Most U.S. orders arrive within 7–14 business days of ordering.",
      "Shipping is always free within the U.S. — the price you see is the price you pay.",
    ],
  },
  {
    q: "What's your return policy?",
    a: [
      "Because every shirt is made to order — and many are personalized with your cleantime — we can't accept returns or exchanges for sizing or a change of mind.",
      `But if your shirt shows up with a print defect, damaged, or it's the wrong item, we'll make it right. Email ${CONTACT_EMAIL} within 30 days with a photo and we'll send a free replacement.`,
    ],
  },
  {
    q: "Can I personalize my shirt?",
    a: [
      "Yes. Many designs let you add your cleantime and choose your color right on the product page, so the shirt is truly yours.",
      "Personalized shirts are final sale (see the return policy above), but the same defect / wrong-item guarantee still covers you.",
    ],
  },
  {
    q: "What payment methods do you accept?",
    a: [
      "We accept card, Cash App Pay, Apple Pay, and Google Pay, all handled securely through Stripe — we never see or store your card details.",
      "PayPal and Venmo are coming soon.",
    ],
  },
  {
    q: "How do I care for my shirt?",
    a: [
      "Turn it inside out and machine wash cold, then tumble dry low. Skip ironing directly over the print. Treat it kindly and the words stay sharp wash after wash.",
    ],
  },
  {
    q: "How do I reach you?",
    a: [
      `Email us any time at ${CONTACT_EMAIL} — order questions, sizing help, or just to tell us which phrase hit home. A real person in recovery reads every message.`,
    ],
  },
];
