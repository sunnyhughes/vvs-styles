import { applyD1Migrations, env, SELF } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Shared mutable state between the mocked Stripe SDK and the tests below.
// `vi.hoisted` runs before the mock factory so the mock can close over it.
const stripeMock = vi.hoisted(() => ({
  nextCreate: {
    id: "pi_test_default",
    client_secret: "cs_test_default",
    status: "requires_payment_method" as const,
    amount: 0,
  },
  createCalls: [] as Array<{ amount: number; metadata?: Record<string, string> }>,
}));

vi.mock("../../src/worker/lib/stripe", () => ({
  createStripeClient: () => ({
    paymentIntents: {
      create: async (args: { amount: number; metadata?: Record<string, string> }) => {
        stripeMock.createCalls.push(args);
        return { ...stripeMock.nextCreate, amount: args.amount };
      },
    },
  }),
}));

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

  // One live shirt at $28.00 for the checkout to resolve against.
  const shirt = await env.DB.prepare(
    `INSERT INTO shirts
       (slug, name, base_price_cents, default_image_url, hero_phrase,
        category, status, cleantime_mode)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
  )
    .bind(
      "test-tee",
      "Test Tee",
      2800,
      "/placeholder-shirt.svg",
      "Still Here, Still Clean",
      "Recovery",
      "live",
      "years",
    )
    .first<{ id: number }>();

  const color = await env.DB.prepare(
    `INSERT INTO colors (name, hex) VALUES (?, ?) RETURNING id`,
  )
    .bind("White", "#FFFFFF")
    .first<{ id: number }>();

  await env.DB.prepare(
    `INSERT INTO shirt_colors (shirt_id, color_id) VALUES (?, ?)`,
  )
    .bind(shirt!.id, color!.id)
    .run();

  // A draft shirt — checkout must not accept it.
  await env.DB.prepare(
    `INSERT INTO shirts
       (slug, name, base_price_cents, default_image_url, hero_phrase, status, cleantime_mode)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      "draft-tee",
      "Draft Tee",
      9900,
      "/placeholder-shirt.svg",
      "Hidden",
      "draft",
      "none",
    )
    .run();
});

beforeEach(() => {
  stripeMock.createCalls = [];
  stripeMock.nextCreate = {
    id: "pi_test_default",
    client_secret: "cs_test_default",
    status: "requires_payment_method",
    amount: 0,
  };
});

const baseShipping = {
  name: "Sunshine Hughes",
  addressLine1: "123 Recovery Rd",
  addressLine2: null,
  city: "Portland",
  state: "OR",
  postalCode: "97201",
  country: "US",
};

const baseItem = {
  slug: "test-tee",
  color: "White",
  colorHex: "#FFFFFF",
  size: "M",
  cleantimeMode: "years" as const,
  cleantimeValue: 3.5,
  qty: 1,
};

describe("POST /api/checkout/payment-intent", () => {
  it("creates a pending order and returns clientSecret", async () => {
    stripeMock.nextCreate = {
      id: "pi_happy_001",
      client_secret: "cs_happy_001",
      status: "requires_payment_method",
      amount: 0,
    };

    const res = await SELF.fetch(
      "https://example.com/api/checkout/payment-intent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "buyer@example.com",
          shipping: baseShipping,
          items: [baseItem, { ...baseItem, qty: 2, size: "L" }],
        }),
      },
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as { orderId: string; clientSecret: string };
    expect(body.clientSecret).toBe("cs_happy_001");
    expect(body.orderId).toMatch(/^[0-9a-f-]{36}$/);

    // Stripe was called with 3 * 2800 = 8400 cents.
    expect(stripeMock.createCalls).toHaveLength(1);
    expect(stripeMock.createCalls[0]?.amount).toBe(8400);
    expect(stripeMock.createCalls[0]?.metadata?.orderId).toBe(body.orderId);

    // Order row landed in D1, pending, with the PI id attached.
    const order = await env.DB.prepare(
      `SELECT status, total_cents, stripe_payment_intent_id, email
       FROM orders WHERE id = ?`,
    )
      .bind(body.orderId)
      .first<{
        status: string;
        total_cents: number;
        stripe_payment_intent_id: string;
        email: string;
      }>();
    expect(order).toMatchObject({
      status: "pending",
      total_cents: 8400,
      stripe_payment_intent_id: "pi_happy_001",
      email: "buyer@example.com",
    });

    // Both line items persisted with the denormalized snapshot.
    const { results: items } = await env.DB.prepare(
      `SELECT shirt_name, size, qty, unit_price_cents
       FROM order_items WHERE order_id = ? ORDER BY id`,
    )
      .bind(body.orderId)
      .all<{
        shirt_name: string;
        size: string;
        qty: number;
        unit_price_cents: number;
      }>();
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      shirt_name: "Test Tee",
      size: "M",
      qty: 1,
      unit_price_cents: 2800,
    });
    expect(items[1]).toMatchObject({ size: "L", qty: 2 });
  });

  it("ignores client-sent price and uses D1's base_price_cents", async () => {
    stripeMock.nextCreate = {
      id: "pi_tamper_001",
      client_secret: "cs_tamper_001",
      status: "requires_payment_method",
      amount: 0,
    };

    const res = await SELF.fetch(
      "https://example.com/api/checkout/payment-intent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "buyer@example.com",
          shipping: baseShipping,
          items: [
            {
              ...baseItem,
              // Malicious client: claim the shirt is 1 cent.
              unitPriceCents: 1,
            },
          ],
        }),
      },
    );

    expect(res.status).toBe(200);
    // Server recalculated from D1 — Stripe was charged the real 2800, not 1.
    expect(stripeMock.createCalls[0]?.amount).toBe(2800);
  });

  it("rejects an unknown shirt slug", async () => {
    const res = await SELF.fetch(
      "https://example.com/api/checkout/payment-intent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "buyer@example.com",
          shipping: baseShipping,
          items: [{ ...baseItem, slug: "no-such-shirt" }],
        }),
      },
    );
    expect(res.status).toBe(400);
    expect(stripeMock.createCalls).toHaveLength(0);
  });

  it("rejects a draft shirt", async () => {
    const res = await SELF.fetch(
      "https://example.com/api/checkout/payment-intent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "buyer@example.com",
          shipping: baseShipping,
          items: [{ ...baseItem, slug: "draft-tee" }],
        }),
      },
    );
    expect(res.status).toBe(400);
  });

  it("rejects a payload missing required fields", async () => {
    const res = await SELF.fetch(
      "https://example.com/api/checkout/payment-intent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          // missing email
          shipping: baseShipping,
          items: [baseItem],
        }),
      },
    );
    expect(res.status).toBe(400);
  });

  it("rejects an empty cart", async () => {
    const res = await SELF.fetch(
      "https://example.com/api/checkout/payment-intent",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "buyer@example.com",
          shipping: baseShipping,
          items: [],
        }),
      },
    );
    expect(res.status).toBe(400);
  });
});
