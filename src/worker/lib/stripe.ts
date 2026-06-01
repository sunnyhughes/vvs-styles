import Stripe from "stripe";

/**
 * Builds a Stripe SDK instance configured for the Cloudflare Workers runtime.
 * `createFetchHttpClient()` swaps the SDK's default Node http transport for
 * `globalThis.fetch`, which is what Workers + Miniflare expose.
 *
 * Tests stub this module via `vi.mock("../../src/worker/lib/stripe")` so they
 * never touch the network.
 */
export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}
