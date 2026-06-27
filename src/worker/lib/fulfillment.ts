import type { DropshipLineItem } from "../integrations/dropship";

/** An order_items row, as far as fulfillment routing cares. */
export interface FulfillmentItem {
  shirt_slug: string;
  color: string;
  size: string;
  cleantime_mode: "none" | "years" | "year_clean";
  qty: number;
}

/** A shirt_variants row: our (slug,color,size) → Printify ids. */
export interface VariantRow {
  shirt_slug: string;
  color: string;
  size: string;
  printify_product_id: string;
  printify_variant_id: number;
}

export type FulfillmentDecision =
  | { method: "auto"; lineItems: DropshipLineItem[] }
  | { method: "manual"; lineItems: [] };

/**
 * Decide how an order is fulfilled. An order is auto-submitted to Printify
 * ONLY when both hold:
 *   1. no line item is personalized (each personalized design needs a unique
 *      print file the founder finalizes by hand), and
 *   2. every line item resolves to a Printify variant in the map.
 * Anything else (any personalized item, any unmapped combo) routes to manual,
 * so the store works before the variant map is filled and never loses an order.
 */
export function decideFulfillment(
  items: FulfillmentItem[],
  variants: VariantRow[],
): FulfillmentDecision {
  if (items.some((it) => it.cleantime_mode !== "none")) {
    return { method: "manual", lineItems: [] };
  }
  const lineItems: DropshipLineItem[] = [];
  for (const it of items) {
    const v = variants.find(
      (v) =>
        v.shirt_slug === it.shirt_slug &&
        v.color === it.color &&
        v.size === it.size,
    );
    if (!v) return { method: "manual", lineItems: [] };
    lineItems.push({
      printifyProductId: v.printify_product_id,
      printifyVariantId: v.printify_variant_id,
      qty: it.qty,
    });
  }
  return { method: "auto", lineItems };
}

/** Split a stored single-field name into Printify's first/last fields. */
export function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}
