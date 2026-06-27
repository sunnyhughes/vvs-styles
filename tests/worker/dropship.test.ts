import { afterEach, describe, expect, it, vi } from "vitest";
import {
  submitPrintifyOrder,
  type DropshipOrderInput,
} from "../../src/worker/integrations/dropship";
import type { Env } from "../../src/worker/types";

const input = (): DropshipOrderInput => ({
  externalId: "order-1",
  lineItems: [{ printifyProductId: "prod_1", printifyVariantId: 111, qty: 2 }],
  address: {
    firstName: "Sunshine",
    lastName: "Hughes",
    email: "buyer@example.com",
    country: "US",
    region: "OR",
    address1: "123 Recovery Rd",
    city: "Portland",
    zip: "97201",
  },
});

const configuredEnv = () =>
  ({ PRINTIFY_API_TOKEN: "pf_test", PRINTIFY_SHOP_ID: "42" }) as Env;

afterEach(() => vi.restoreAllMocks());

describe("submitPrintifyOrder", () => {
  it("returns null (skips) when not configured", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(await submitPrintifyOrder({} as Env, input())).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns null when there are no line items", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const empty = { ...input(), lineItems: [] };
    expect(await submitPrintifyOrder(configuredEnv(), empty)).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("POSTs to the shop orders endpoint and returns the Printify id", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ id: "po_abc" }), { status: 200 }),
      );

    const id = await submitPrintifyOrder(configuredEnv(), input());

    expect(id).toBe("po_abc");
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.printify.com/v1/shops/42/orders.json");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer pf_test");
    expect(headers["User-Agent"]).toContain("vvs-styles");
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      external_id: "order-1",
      line_items: [{ product_id: "prod_1", variant_id: 111, quantity: 2 }],
    });
    expect(body.address_to).toMatchObject({
      first_name: "Sunshine",
      last_name: "Hughes",
      region: "OR",
      zip: "97201",
    });
  });

  it("returns null on a non-2xx response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("nope", { status: 400 }),
    );
    expect(await submitPrintifyOrder(configuredEnv(), input())).toBeNull();
  });
});
