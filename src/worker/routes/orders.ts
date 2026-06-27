import { Hono } from "hono";
import { createStripeClient } from "../lib/stripe";
import { submitPrintifyOrder } from "../integrations/dropship";
import {
  buildCustomerEmail,
  buildFounderEmail,
  sendEmail,
  type EmailLine,
  type OrderEmailData,
} from "../integrations/email";
import {
  decideFulfillment,
  splitName,
  type FulfillmentItem,
  type VariantRow,
} from "../lib/fulfillment";
import type { Env } from "../types";

export const orders = new Hono<{ Bindings: Env }>();

interface OrderRow {
  email: string;
  shipping_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  total_cents: number;
}

interface RawItem {
  shirt_slug: string;
  shirt_name: string;
  color: string;
  size: string;
  cleantime_mode: "none" | "years" | "year_clean";
  cleantime_value: number;
  unit_price_cents: number;
  qty: number;
}

/** Render the stored shipping fields into a single human-readable block. */
function formatAddress(o: OrderRow): string {
  const l2 = o.shipping_address_line2 ? `\n${o.shipping_address_line2}` : "";
  return `${o.shipping_address_line1}${l2}\n${o.shipping_city}, ${o.shipping_state} ${o.shipping_postal_code}\n${o.shipping_country}`;
}

/**
 * Runs once when an order transitions to 'paid'. Routes fulfillment to Printify
 * (auto) or the founder (manual), then emails the customer. Best-effort: every
 * external call degrades gracefully, and the caller wraps this in try/catch so
 * nothing here can fail an already-paid order.
 */
async function fulfillPaidOrder(env: Env, orderId: string): Promise<void> {
  const order = await env.DB.prepare(
    `SELECT email, shipping_name, shipping_address_line1, shipping_address_line2,
            shipping_city, shipping_state, shipping_postal_code, shipping_country,
            total_cents
     FROM orders WHERE id = ?`,
  )
    .bind(orderId)
    .first<OrderRow>();
  if (!order) return;

  const { results: items } = await env.DB.prepare(
    `SELECT shirt_slug, shirt_name, color, size,
            cleantime_mode, cleantime_value, unit_price_cents, qty
     FROM order_items WHERE order_id = ?`,
  )
    .bind(orderId)
    .all<RawItem>();

  // Project the rows into the two shapes the helpers expect.
  const fulfillItems: FulfillmentItem[] = items.map((r) => ({
    shirt_slug: r.shirt_slug,
    color: r.color,
    size: r.size,
    cleantime_mode: r.cleantime_mode,
    qty: r.qty,
  }));
  const emailLines: EmailLine[] = items.map((r) => ({
    shirtName: r.shirt_name,
    color: r.color,
    size: r.size,
    qty: r.qty,
    cleantimeMode: r.cleantime_mode,
    cleantimeValue: r.cleantime_value,
    unitPriceCents: r.unit_price_cents,
  }));

  const { results: variants } = await env.DB.prepare(
    `SELECT shirt_slug, color, size, printify_product_id, printify_variant_id
     FROM shirt_variants`,
  ).all<VariantRow>();

  const decision = decideFulfillment(fulfillItems, variants);
  let method: "auto" | "manual" = decision.method;
  let dropshipOrderId: string | null = null;
  let submittedAt: number | null = null;

  if (decision.method === "auto") {
    const name = splitName(order.shipping_name);
    dropshipOrderId = await submitPrintifyOrder(env, {
      externalId: orderId,
      lineItems: decision.lineItems,
      address: {
        firstName: name.firstName,
        lastName: name.lastName,
        email: order.email,
        country: order.shipping_country,
        region: order.shipping_state,
        address1: order.shipping_address_line1,
        address2: order.shipping_address_line2 ?? undefined,
        city: order.shipping_city,
        zip: order.shipping_postal_code,
      },
    });
    if (dropshipOrderId) {
      submittedAt = Date.now();
    } else {
      method = "manual"; // Printify call failed → fall back to manual entry
    }
  }

  const emailData: OrderEmailData = {
    orderId,
    email: order.email,
    shippingName: order.shipping_name,
    shippingAddress: formatAddress(order),
    totalCents: order.total_cents,
    items: emailLines,
  };

  const customer = buildCustomerEmail(emailData);
  const customerSent = await sendEmail(env, {
    to: order.email,
    subject: customer.subject,
    html: customer.html,
  });

  if (env.FOUNDER_EMAIL) {
    const founder = buildFounderEmail(emailData, { method, dropshipOrderId });
    await sendEmail(env, {
      to: env.FOUNDER_EMAIL,
      subject: founder.subject,
      html: founder.html,
    });
  }

  await env.DB.prepare(
    `UPDATE orders
       SET fulfillment_method = ?, dropship_order_id = ?,
           submitted_to_dropship_at = ?, confirmation_email_sent_at = ?
     WHERE id = ?`,
  )
    .bind(
      method,
      dropshipOrderId,
      submittedAt,
      customerSent ? Date.now() : null,
      orderId,
    )
    .run();
}

// GET /api/orders/:id — the order + its items, for the confirmation page.
// Order ids are UUIDs, so the URL is non-enumerable.
orders.get("/:id", async (c) => {
  const id = c.req.param("id");

  const order = await c.env.DB.prepare(
    `SELECT id, created_at, email,
            shipping_name, shipping_address_line1, shipping_address_line2,
            shipping_city, shipping_state, shipping_postal_code, shipping_country,
            subtotal_cents, total_cents, status, stripe_payment_intent_id
     FROM orders WHERE id = ?`,
  )
    .bind(id)
    .first();

  if (!order) return c.json({ error: "Order not found" }, 404);

  const { results: items } = await c.env.DB.prepare(
    `SELECT shirt_slug, shirt_name, color, color_hex, size,
            cleantime_mode, cleantime_value, unit_price_cents, qty
     FROM order_items WHERE order_id = ?`,
  )
    .bind(id)
    .all();

  return c.json({ ...order, items });
});

// POST /api/orders/:id/confirm — called by the confirmation page after Stripe
// redirects back. Checks the Payment Intent with Stripe directly (not the
// client's claim that it succeeded) and only flips the order to 'paid' when
// the PI says succeeded AND the amount matches our recorded total.
orders.post("/:id/confirm", async (c) => {
  const id = c.req.param("id");

  const order = await c.env.DB.prepare(
    `SELECT id, total_cents, status, stripe_payment_intent_id
     FROM orders WHERE id = ?`,
  )
    .bind(id)
    .first<{
      id: string;
      total_cents: number;
      status: string;
      stripe_payment_intent_id: string | null;
    }>();

  if (!order) return c.json({ error: "Order not found" }, 404);

  // Idempotent — if the confirm page is reloaded after success, return ok.
  if (order.status === "paid") return c.json({ status: "paid" });

  if (!order.stripe_payment_intent_id) {
    return c.json({ error: "Order has no Payment Intent" }, 409);
  }

  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);
  const pi = await stripe.paymentIntents.retrieve(
    order.stripe_payment_intent_id,
  );

  if (pi.status !== "succeeded") {
    return c.json(
      { error: `Payment not succeeded (status=${pi.status})` },
      409,
    );
  }
  if (pi.amount !== order.total_cents) {
    return c.json({ error: "Payment amount mismatch" }, 409);
  }

  await c.env.DB.prepare(`UPDATE orders SET status = 'paid' WHERE id = ?`)
    .bind(id)
    .run();

  // Route fulfillment + send confirmation. Best-effort: the order is already
  // paid, so a Printify or email failure must not turn this into an error.
  try {
    await fulfillPaidOrder(c.env, id);
  } catch (err) {
    console.error("fulfillment error", err);
  }

  return c.json({ status: "paid" });
});
