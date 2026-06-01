import { Hono } from "hono";
import { createStripeClient } from "../lib/stripe";
import type { Env } from "../types";

export const orders = new Hono<{ Bindings: Env }>();

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

  return c.json({ status: "paid" });
});
