import { Hono } from "hono";
import { shirts } from "./routes/shirts";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));
app.route("/api/shirts", shirts);

export default app;
