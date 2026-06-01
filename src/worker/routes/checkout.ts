import { Hono } from "hono";
import { createStripeClient } from "../lib/stripe";
import type { Env } from "../types";

/** A line item as the client posts it. */
interface CheckoutItemInput {
  slug: string;
  color: string;
  colorHex: string;
  size: string;
  cleantimeMode: "none" | "years" | "year_clean";
  cleantimeValue: number;
  qty: number;
}

interface ShippingAddressInput {
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutPayload {
  items: CheckoutItemInput[];
  shipping: ShippingAddressInput;
  email: string;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function parsePayload(body: unknown): CheckoutPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.email)) return null;
  if (!Array.isArray(b.items) || b.items.length === 0) return null;

  const ship = b.shipping as Record<string, unknown> | undefined;
  if (!ship || typeof ship !== "object") return null;
  if (
    !isNonEmptyString(ship.name) ||
    !isNonEmptyString(ship.addressLine1) ||
    !isNonEmptyString(ship.city) ||
    !isNonEmptyString(ship.state) ||
    !isNonEmptyString(ship.postalCode) ||
    !isNonEmptyString(ship.country)
  ) {
    return null;
  }
  if (ship.addressLine2 != null && typeof ship.addressLine2 !== "string") {
    return null;
  }

  for (const raw of b.items) {
    if (!raw || typeof raw !== "object") return null;
    const it = raw as Record<string, unknown>;
    if (
      !isNonEmptyString(it.slug) ||
      !isNonEmptyString(it.color) ||
      !isNonEmptyString(it.colorHex) ||
      !isNonEmptyString(it.size)
    ) {
      return null;
    }
    if (
      it.cleantimeMode !== "none" &&
      it.cleantimeMode !== "years" &&
      it.cleantimeMode !== "year_clean"
    ) {
      return null;
    }
    if (typeof it.cleantimeValue !== "number") return null;
    if (typeof it.qty !== "number" || it.qty <= 0) return null;
  }

  return body as CheckoutPayload;
}

export const checkout = new Hono<{ Bindings: Env }>();

// POST /api/checkout/payment-intent
// Resolves each item's price from D1 (the cart lives in localStorage and is
// editable, so the server never trusts client-sent prices), creates a pending
// orders row + order_items, and asks Stripe for a Payment Intent. The
// returned client_secret is what the Payment Element on the frontend uses to
// confirm payment.
checkout.post("/payment-intent", async (c) => {
  const body = await c.req.json().catch(() => null);
  const payload = parsePayload(body);
  if (!payload) {
    return c.json({ error: "Invalid checkout payload" }, 400);
  }

  
  // Server-side price lookup. Unknown / draft slugs fail the checkout.
  const resolved: Array<{
    input: CheckoutItemInput;
    name: string;
    unitPriceCents: number;
  }> = [];
  for (const item of payload.items) {
    const shirt = await c.env.DB.prepare(
      `SELECT name, base_price_cents FROM shirts WHERE slug = ? AND status = 'live'`,
    )
      .bind(item.slug)
      .first<{ name: string; base_price_cents: number }>();
    if (!shirt) {
      return c.json({ error: `Unknown shirt: ${item.slug}` }, 400);
    }
    resolved.push({
      input: item,
      name: shirt.name,
      unitPriceCents: shirt.base_price_cents,
    });
  }

  const totalCents = resolved.reduce(
    (sum, r) => sum + r.unitPriceCents * r.input.qty,
    0,
  );
  if (totalCents <= 0) return c.json({ error: "Empty order" }, 400);

  const orderId = crypto.randomUUID();
  const now = Date.now();

  await c.env.DB.prepare(
    `INSERT INTO orders
       (id, created_at, email,
        shipping_name, shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_postal_code, shipping_country,
        subtotal_cents, total_cents, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
  )
    .bind(
      orderId,
      now,
      payload.email,
      payload.shipping.name,
      payload.shipping.addressLine1,
      payload.shipping.addressLine2 ?? null,
      payload.shipping.city,
      payload.shipping.state,
      payload.shipping.postalCode,
      payload.shipping.country,
      totalCents,
      totalCents,
    )
    .run();

  for (const r of resolved) {
    await c.env.DB.prepare(
      `INSERT INTO order_items
         (order_id, shirt_slug, shirt_name, color, color_hex, size,
          cleantime_mode, cleantime_value, unit_price_cents, qty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        orderId,
        r.input.slug,
        r.name,
        r.input.color,
        r.input.colorHex,
        r.input.size,
        r.input.cleantimeMode,
        r.input.cleantimeValue,
        r.unitPriceCents,
        r.input.qty,
      )
      .run();
  }

  // automatic_payment_methods=true tells Stripe to render whichever methods
  // are enabled in the dashboard (card, Cash App Pay, Apple/Google Pay) —
  // no per-method code on the client.
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);
  const pi = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: "usd",
    metadata: { orderId },
    automatic_payment_methods: { enabled: true },
  });

  await c.env.DB.prepare(
    `UPDATE orders SET stripe_payment_intent_id = ? WHERE id = ?`,
  )
    .bind(pi.id, orderId)
    .run();

  return c.json({ orderId, clientSecret: pi.client_secret });
});
