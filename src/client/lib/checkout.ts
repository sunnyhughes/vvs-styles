import type { CartItem } from "./cart";

/** Shipping address as the client posts it to the checkout endpoint. */
export interface ShippingAddress {
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/** Body for `POST /api/checkout/payment-intent`. */
export interface CheckoutPayload {
  items: CartItem[];
  shipping: ShippingAddress;
  email: string;
}

interface PaymentIntentResponse {
  orderId: string;
  clientSecret: string;
}

interface OrderItemRow {
  shirt_slug: string;
  shirt_name: string;
  color: string;
  color_hex: string;
  size: string;
  cleantime_mode: "none" | "years" | "year_clean";
  cleantime_value: number;
  unit_price_cents: number;
  qty: number;
}

/** Order as returned by `GET /api/orders/:id`. */
export interface OrderResponse {
  id: string;
  created_at: number;
  email: string;
  shipping_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal_cents: number;
  total_cents: number;
  status: "pending" | "paid" | "failed";
  stripe_payment_intent_id: string | null;
  items: OrderItemRow[];
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

export function createPaymentIntent(
  payload: CheckoutPayload,
): Promise<PaymentIntentResponse> {
  return postJson<PaymentIntentResponse>(
    "/api/checkout/payment-intent",
    payload,
  );
}

export function confirmOrder(
  orderId: string,
): Promise<{ status: string; error?: string }> {
  return postJson(`/api/orders/${encodeURIComponent(orderId)}/confirm`, {});
}

export async function getOrder(orderId: string): Promise<OrderResponse> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
  if (!res.ok) {
    throw new Error(`GET order ${orderId} failed with ${res.status}`);
  }
  return (await res.json()) as OrderResponse;
}

/** Fetches the runtime config (publishable Stripe key). */
export async function getStripePublishableKey(): Promise<string> {
  const res = await fetch("/api/config");
  if (!res.ok) throw new Error(`/api/config failed with ${res.status}`);
  const body = (await res.json()) as { stripePublishableKey: string };
  return body.stripePublishableKey;
}
