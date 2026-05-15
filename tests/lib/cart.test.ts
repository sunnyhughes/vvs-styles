import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addToCart,
  cartCount,
  cartSubtotalCents,
  clearCart,
  getCart,
  type NewCartItem,
  removeFromCart,
  updateQty,
} from "../../src/client/lib/cart";

const baseItem: NewCartItem = {
  slug: "still-here",
  name: "Still Here Tee",
  unitPriceCents: 2800,
  imageUrl: "/placeholder-shirt.svg",
  program: "Alcoholics Anonymous",
  color: "Forest Green",
  colorHex: "#166534",
  size: "M",
  cleanTimeYears: 3.5,
};

beforeEach(() => {
  localStorage.clear();
  clearCart();
});

describe("cart", () => {
  it("adds an item with quantity 1", () => {
    addToCart(baseItem);
    expect(getCart()).toHaveLength(1);
    expect(getCart()[0]!.qty).toBe(1);
  });

  it("merges identical configurations into one line", () => {
    addToCart(baseItem);
    addToCart(baseItem);
    expect(getCart()).toHaveLength(1);
    expect(getCart()[0]!.qty).toBe(2);
  });

  it("keeps different option-combinations as separate lines", () => {
    addToCart(baseItem);
    addToCart({ ...baseItem, size: "L" });
    expect(getCart()).toHaveLength(2);
  });

  it("removes a line", () => {
    addToCart(baseItem);
    removeFromCart(getCart()[0]!.lineId);
    expect(getCart()).toHaveLength(0);
  });

  it("updates a line's quantity", () => {
    addToCart(baseItem);
    updateQty(getCart()[0]!.lineId, 4);
    expect(getCart()[0]!.qty).toBe(4);
  });

  it("removes a line when its quantity drops to zero", () => {
    addToCart(baseItem);
    updateQty(getCart()[0]!.lineId, 0);
    expect(getCart()).toHaveLength(0);
  });

  it("computes total count and subtotal", () => {
    addToCart(baseItem);
    addToCart({ ...baseItem, size: "L" });
    addToCart(baseItem); // merges into the first line
    expect(cartCount()).toBe(3);
    expect(cartSubtotalCents()).toBe(2800 * 3);
  });

  it("persists across a page reload", async () => {
    addToCart(baseItem);
    expect(localStorage.getItem("vvs-cart")).toContain("still-here");

    // Simulate a reload: drop the module cache and re-import a fresh store.
    vi.resetModules();
    const fresh = await import("../../src/client/lib/cart");
    expect(fresh.getCart()).toHaveLength(1);
    expect(fresh.getCart()[0]!.slug).toBe("still-here");
  });
});
