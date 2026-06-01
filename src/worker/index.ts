import { Hono } from "hono";
import { checkout } from "./routes/checkout";
import { config } from "./routes/config";
import { orders } from "./routes/orders";
import { shirts } from "./routes/shirts";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));
app.route("/api/shirts", shirts);
app.route("/api/checkout", checkout);
app.route("/api/orders", orders);
app.route("/api/config", config);

export default app;
