import { Hono } from "hono";
import type { Env } from "../types";

/** Exposes runtime configuration the React client needs at boot. */
export const config = new Hono<{ Bindings: Env }>();

config.get("/", (c) => {
  return c.json({
    stripePublishableKey: c.env.STRIPE_PUBLISHABLE_KEY,
  });
});
