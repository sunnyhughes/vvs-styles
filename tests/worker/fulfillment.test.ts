import { describe, expect, it } from "vitest";
import {
  decideFulfillment,
  splitName,
  type FulfillmentItem,
  type VariantRow,
} from "../../src/worker/lib/fulfillment";

const variant = (
  shirt_slug: string,
  color: string,
  size: string,
  pid: string,
  vid: number,
): VariantRow => ({
  shirt_slug,
  color,
  size,
  printify_product_id: pid,
  printify_variant_id: vid,
});

const item = (
  over: Partial<FulfillmentItem> = {},
): FulfillmentItem => ({
  shirt_slug: "worst-idea",
  color: "White",
  size: "M",
  cleantime_mode: "none",
  qty: 1,
  ...over,
});

describe("decideFulfillment", () => {
  it("auto-submits when all items are plain and every combo is mapped", () => {
    const variants = [variant("worst-idea", "White", "M", "prod_1", 111)];
    const d = decideFulfillment([item()], variants);
    expect(d.method).toBe("auto");
    expect(d.lineItems).toEqual([
      { printifyProductId: "prod_1", printifyVariantId: 111, qty: 1 },
    ]);
  });

  it("routes to manual if ANY item is personalized", () => {
    const variants = [
      variant("worst-idea", "White", "M", "prod_1", 111),
      variant("clean-and-serene-since", "Gray", "L", "prod_2", 222),
    ];
    const d = decideFulfillment(
      [
        item(),
        item({
          shirt_slug: "clean-and-serene-since",
          color: "Gray",
          size: "L",
          cleantime_mode: "year_clean",
        }),
      ],
      variants,
    );
    expect(d.method).toBe("manual");
    expect(d.lineItems).toEqual([]);
  });

  it("routes to manual when a plain combo is not in the variant map", () => {
    const d = decideFulfillment([item({ size: "2XL" })], [
      variant("worst-idea", "White", "M", "prod_1", 111),
    ]);
    expect(d.method).toBe("manual");
  });

  it("carries quantity through to the line item", () => {
    const variants = [variant("worst-idea", "White", "M", "prod_1", 111)];
    const d = decideFulfillment([item({ qty: 3 })], variants);
    expect(d.method === "auto" && d.lineItems[0]?.qty).toBe(3);
  });
});

describe("splitName", () => {
  it("splits first and last", () => {
    expect(splitName("Sunshine Hughes")).toEqual({
      firstName: "Sunshine",
      lastName: "Hughes",
    });
  });
  it("keeps multi-word surnames intact", () => {
    expect(splitName("Mary Jo Van Pelt")).toEqual({
      firstName: "Mary",
      lastName: "Jo Van Pelt",
    });
  });
  it("handles a single name", () => {
    expect(splitName("Cher")).toEqual({ firstName: "Cher", lastName: "" });
  });
});
