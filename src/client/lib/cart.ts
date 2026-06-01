import { useSyncExternalStore } from "react";
import type { CleantimeMode } from "../../shared/types";

/**
 * A line item in the cart. One row per unique option-combination — adding the
 * same shirt with the same color/size/cleantime bumps `qty` instead of
 * creating a second line.
 */
export interface CartItem {
  /** Stable id derived from the chosen options; identical configs share one. */
  lineId: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  imageUrl: string;
  color: string;
  colorHex: string;
  size: string;
  /** Per-shirt customization mode — drives how cleantimeValue is rendered. */
  cleantimeMode: CleantimeMode;
  /**
   * Numeric value for the customization slot. For 'years' it's years clean
   * (e.g. 3.5); for 'year_clean' it's a year (e.g. 1953). 0 means the buyer
   * left it blank or the shirt takes no customization.
   */
  cleantimeValue: number;
  qty: number;
}

/** A cart item before it has been assigned a line id and quantity. */
export type NewCartItem = Omit<CartItem, "lineId" | "qty"> & { qty?: number };

const STORAGE_KEY = "vvs-cart";

/** Builds the stable line id for an option-combination. */
function lineIdFor(item: NewCartItem): string {
  return [
    item.slug,
    item.color,
    item.size,
    item.cleantimeMode,
    item.cleantimeValue,
  ].join("|");
}

/** Reads the persisted cart, tolerating missing or corrupt storage. */
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

// Module-level store. The cart array reference changes on every mutation so
// `useSyncExternalStore` can detect updates by identity.
let cart: CartItem[] = loadCart();
let drawerOpen = false;
const listeners = new Set<() => void>();

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage unavailable (private mode, quota) — cart stays in memory only.
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Current cart contents. */
export function getCart(): CartItem[] {
  return cart;
}

/** Adds an item, merging into an existing line with the same options. */
export function addToCart(item: NewCartItem): void {
  const lineId = lineIdFor(item);
  const qty = item.qty ?? 1;
  const existing = cart.find((c) => c.lineId === lineId);
  if (existing) {
    cart = cart.map((c) =>
      c.lineId === lineId ? { ...c, qty: c.qty + qty } : c,
    );
  } else {
    cart = [...cart, { ...item, lineId, qty }];
  }
  persist();
  emit();
}

/** Removes a line entirely. */
export function removeFromCart(lineId: string): void {
  cart = cart.filter((c) => c.lineId !== lineId);
  persist();
  emit();
}

/** Sets a line's quantity; a quantity of zero or less removes the line. */
export function updateQty(lineId: string, qty: number): void {
  if (qty <= 0) {
    removeFromCart(lineId);
    return;
  }
  cart = cart.map((c) => (c.lineId === lineId ? { ...c, qty } : c));
  persist();
  emit();
}

/** Empties the cart. */
export function clearCart(): void {
  cart = [];
  persist();
  emit();
}

/** Total number of shirts across all lines. */
export function cartCount(items: CartItem[] = cart): number {
  return items.reduce((sum, c) => sum + c.qty, 0);
}

/** Cart subtotal in cents. */
export function cartSubtotalCents(items: CartItem[] = cart): number {
  return items.reduce((sum, c) => sum + c.unitPriceCents * c.qty, 0);
}

/** Opens the slide-over cart drawer. */
export function openCart(): void {
  drawerOpen = true;
  emit();
}

/** Closes the slide-over cart drawer. */
export function closeCart(): void {
  drawerOpen = false;
  emit();
}

function isCartOpen(): boolean {
  return drawerOpen;
}

/** React hook: the current cart, re-rendering on every change. */
export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getCart, getCart);
}

/** React hook: whether the cart drawer is open. */
export function useCartDrawerOpen(): boolean {
  return useSyncExternalStore(subscribe, isCartOpen, isCartOpen);
}

/** Formats the customization slot for display, based on mode + value. */
export function formatCleanTime(mode: CleantimeMode, value: number): string {
  if (!value || value <= 0 || mode === "none") return "";
  if (mode === "year_clean") return `Since ${value}`;
  return `${value} ${value === 1 ? "Year" : "Years"} Clean`;
}
