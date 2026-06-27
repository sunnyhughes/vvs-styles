import type { Env } from "../types";

/**
 * Printify order client. v1 only needs to submit an order built from
 * already-published products — POST /v1/shops/{shop_id}/orders.json with
 * line items of {product_id, variant_id, quantity}. (Personalized designs are
 * fulfilled by hand, so we never need the print-file upload flow here.)
 *
 * Like email, submission is best-effort: any failure returns null and the
 * caller falls back to the manual founder path, so a paid order is never lost
 * to a Printify outage or a half-configured environment.
 */
export interface DropshipLineItem {
  printifyProductId: string;
  printifyVariantId: number;
  qty: number;
}

export interface DropshipAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string; // ISO-2, e.g. "US"
  region: string; // state, e.g. "OR"
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface DropshipOrderInput {
  externalId: string; // our order id — Printify dedupes/cross-refs on this
  label?: string;
  lineItems: DropshipLineItem[];
  address: DropshipAddress;
}

export async function submitPrintifyOrder(
  env: Env,
  input: DropshipOrderInput,
): Promise<string | null> {
  if (!env.PRINTIFY_API_TOKEN || !env.PRINTIFY_SHOP_ID) {
    console.warn("printify skipped: PRINTIFY_API_TOKEN / PRINTIFY_SHOP_ID not configured");
    return null;
  }
  if (input.lineItems.length === 0) return null;

  try {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${env.PRINTIFY_SHOP_ID}/orders.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.PRINTIFY_API_TOKEN}`,
          "Content-Type": "application/json",
          // Printify requires a User-Agent identifying the client.
          "User-Agent": "vvs-styles/1.0 (+https://vvs-styles.sunshinehughes.workers.dev)",
        },
        body: JSON.stringify({
          external_id: input.externalId,
          label: input.label ?? input.externalId,
          line_items: input.lineItems.map((li) => ({
            product_id: li.printifyProductId,
            variant_id: li.printifyVariantId,
            quantity: li.qty,
          })),
          shipping_method: 1, // 1 = standard
          send_shipping_notification: false,
          address_to: {
            first_name: input.address.firstName,
            last_name: input.address.lastName,
            email: input.address.email,
            phone: input.address.phone ?? "",
            country: input.address.country,
            region: input.address.region,
            address1: input.address.address1,
            address2: input.address.address2 ?? "",
            city: input.address.city,
            zip: input.address.zip,
          },
        }),
      },
    );

    if (!res.ok) {
      console.error("printify order failed", res.status, await res.text());
      return null;
    }
    const body = (await res.json()) as { id?: string };
    return body.id ?? null;
  } catch (err) {
    console.error("printify order error", err);
    return null;
  }
}
