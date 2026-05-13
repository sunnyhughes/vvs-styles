import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("GET /api/health returns { ok: true }", async () => {
    const res = await SELF.fetch("https://example.com/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
