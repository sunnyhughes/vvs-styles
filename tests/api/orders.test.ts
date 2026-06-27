import { applyD1Migrations, env, SELF } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const stripeMock = vi.hoisted(() => ({
  nextRetrieve: {
    id: "pi_default",
    status: "succeeded" as
      | "succeeded"
      | "requires_payment_method"
      | "processing"
      | "canceled",
    amount: 0,
  },
}));

vi.mock("../../src/worker/lib/stripe", () => ({
  createStripeClient: () => ({
    paymentIntents: {
      retrieve: async (_id: string) => stripeMock.nextRetrieve,
    },
  }),
}));

const SHIPPING = {
  shipping_name: "Sunshine Hughes",
  shipping_address_line1: "123 Recovery Rd",
  shipping_address_line2: null as string | null,
  shipping_city: "Portland",
  shipping_state: "OR",
  shipping_postal_code: "97201",
  shipping_country: "US",
};

/** Inserts a fresh pending order + one item, returning the order id. */
async function seedOrder(
  totalCents: number,
  piId: string | null,
): Promise<string> {
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO orders
       (id, created_at, email,
        shipping_name, shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_postal_code, shipping_country,
        subtotal_cents, total_cents, status, stripe_payment_intent_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
  )
    .bind(
      id,
      Date.now(),
      "buyer@example.com",
      SHIPPING.shipping_name,
      SHIPPING.shipping_address_line1,
      SHIPPING.shipping_address_line2,
      SHIPPING.shipping_city,
      SHIPPING.shipping_state,
      SHIPPING.shipping_postal_code,
      SHIPPING.shipping_country,
      totalCents,
      totalCents,
      piId,
    )
    .run();

  await env.DB.prepare(
    `INSERT INTO order_items
       (order_id, shirt_slug, shirt_name, color, color_hex, size,
        cleantime_mode, cleantime_value, unit_price_cents, qty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      "test-tee",
      "Test Tee",
      "White",
      "#FFFFFF",
      "M",
      "years",
      3.5,
      totalCents,
      1,
    )
    .run();

  return id;
}

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(() => {
  stripeMock.nextRetrieve = {
    id: "pi_default",
    status: "succeeded",
    amount: 0,
  };
});

describe("GET /api/orders/:id", () => {
  it("returns the order + items", async () => {
    const orderId = await seedOrder(2800, "pi_get_001");

    const res = await SELF.fetch(`https://example.com/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      id: string;
      total_cents: number;
      status: string;
      items: Array<{ shirt_name: string }>;
    };
    expect(body).toMatchObject({
      id: orderId,
      total_cents: 2800,
      status: "pending",
    });
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.shirt_name).toBe("Test Tee");
  });

  it("returns 404 for an unknown id", async () => {
    const res = await SELF.fetch(
      `https://example.com/api/orders/${crypto.randomUUID()}`,
    );
    expect(res.status).toBe(404);
  });
});

describe("POST /api/orders/:id/confirm", () => {
  it("flips status to paid when the PI succeeded and the amount matches", async () => {
    const orderId = await seedOrder(2800, "pi_confirm_001");
    stripeMock.nextRetrieve = {
      id: "pi_confirm_001",
      status: "succeeded",
      amount: 2800,
    };

    const res = await SELF.fetch(
      `https://example.com/api/orders/${orderId}/confirm`,
      { method: "POST" },
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("paid");

    const row = await env.DB.prepare(
      `SELECT status FROM orders WHERE id = ?`,
    )
      .bind(orderId)
      .first<{ status: string }>();
    expect(row?.status).toBe("paid");
  });

  it("routes a personalized order to manual fulfillment on confirm", async () => {
    // seedOrder inserts a 'years' (personalized) item, and the test env has no
    // Printify/Resend config — so fulfillment must land on the manual path
    // without throwing or blocking the paid response.
    const orderId = await seedOrder(2499, "pi_fulfill_001");
    stripeMock.nextRetrieve = {
      id: "pi_fulfill_001",
      status: "succeeded",
      amount: 2499,
    };

    const res = await SELF.fetch(
      `https://example.com/api/orders/${orderId}/confirm`,
      { method: "POST" },
    );
    expect(res.status).toBe(200);

    const row = await env.DB.prepare(
      `SELECT status, fulfillment_method, dropship_order_id
       FROM orders WHERE id = ?`,
    )
      .bind(orderId)
      .first<{
        status: string;
        fulfillment_method: string | null;
        dropship_order_id: string | null;
      }>();
    expect(row?.status).toBe("paid");
    expect(row?.fulfillment_method).toBe("manual");
    expect(row?.dropship_order_id).toBeNull();
  });

  it("rejects when the PI amount does not match the order total", async () => {
    const orderId = await seedOrder(2800, "pi_mismatch_001");
    stripeMock.nextRetrieve = {
      id: "pi_mismatch_001",
      status: "succeeded",
      amount: 1, // attacker tried to underpay
    };

    const res = await SELF.fetch(
      `https://example.com/api/orders/${orderId}/confirm`,
      { method: "POST" },
    );
    expect(res.status).toBe(409);

    const row = await env.DB.prepare(
      `SELECT status FROM orders WHERE id = ?`,
    )
      .bind(orderId)
      .first<{ status: string }>();
    expect(row?.status).toBe("pending");
  });

  it("rejects when the PI is not yet succeeded", async () => {
    const orderId = await seedOrder(2800, "pi_processing_001");
    stripeMock.nextRetrieve = {
      id: "pi_processing_001",
      status: "processing",
      amount: 2800,
    };

    const res = await SELF.fetch(
      `https://example.com/api/orders/${orderId}/confirm`,
      { method: "POST" },
    );
    expect(res.status).toBe(409);
  });

  it("is idempotent — already-paid orders return ok", async () => {
    const orderId = await seedOrder(2800, "pi_idempotent_001");
    await env.DB.prepare(`UPDATE orders SET status = 'paid' WHERE id = ?`)
      .bind(orderId)
      .run();

    const res = await SELF.fetch(
      `https://example.com/api/orders/${orderId}/confirm`,
      { method: "POST" },
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("paid");
  });

  it("returns 404 for an unknown order id", async () => {
    const res = await SELF.fetch(
      `https://example.com/api/orders/${crypto.randomUUID()}/confirm`,
      { method: "POST" },
    );
    expect(res.status).toBe(404);
  });
});
