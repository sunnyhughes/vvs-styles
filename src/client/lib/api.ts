import type { Shirt, ShirtDetail } from "../../shared/types";

/** Typed `fetch` wrapper for the Worker's `/api/*` endpoints. */
async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Fetches the full shirt catalog from `GET /api/shirts`. */
export function getShirts(): Promise<Shirt[]> {
  return fetchJson<Shirt[]>("/api/shirts");
}

/** Fetches one shirt plus its options from `GET /api/shirts/:slug`. */
export function getShirt(slug: string): Promise<ShirtDetail> {
  return fetchJson<ShirtDetail>(`/api/shirts/${encodeURIComponent(slug)}`);
}

/** Formats a price in cents as US dollars, e.g. 2800 → "$28.00". */
export function formatPriceUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
