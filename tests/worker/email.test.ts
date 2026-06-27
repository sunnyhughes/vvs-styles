import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildCustomerEmail,
  buildFounderEmail,
  cleantimeLabel,
  sendEmail,
  shortRef,
  type EmailLine,
  type OrderEmailData,
} from "../../src/worker/integrations/email";
import type { Env } from "../../src/worker/types";

const line = (over: Partial<EmailLine> = {}): EmailLine => ({
  shirtName: "Worst Idea Tee",
  color: "White",
  size: "M",
  qty: 1,
  cleantimeMode: "none",
  cleantimeValue: 0,
  unitPriceCents: 2499,
  ...over,
});

const data = (over: Partial<OrderEmailData> = {}): OrderEmailData => ({
  orderId: "abcd1234-ef56-7890-abcd-ef1234567890",
  email: "buyer@example.com",
  shippingName: "Sunshine Hughes",
  shippingAddress: "123 Recovery Rd\nPortland, OR 97201\nUS",
  totalCents: 2499,
  items: [line()],
  ...over,
});

afterEach(() => vi.restoreAllMocks());

describe("cleantimeLabel", () => {
  it("formats years clean", () => {
    expect(cleantimeLabel("years", 3)).toBe("3 years clean");
    expect(cleantimeLabel("years", 1)).toBe("1 year clean");
    expect(cleantimeLabel("years", 3.5)).toBe("3.5 years clean");
  });
  it("formats clean-since year", () => {
    expect(cleantimeLabel("year_clean", 2019)).toBe("Clean since 2019");
  });
  it("returns null for plain designs", () => {
    expect(cleantimeLabel("none", 0)).toBeNull();
  });
});

describe("shortRef", () => {
  it("is the first 8 hex chars, upper-cased", () => {
    expect(shortRef("abcd1234-ef56-7890-abcd-ef1234567890")).toBe("ABCD1234");
  });
});

describe("buildCustomerEmail", () => {
  it("includes the ref, items, and total", () => {
    const { subject, html } = buildCustomerEmail(data());
    expect(subject).toContain("ABCD1234");
    expect(html).toContain("Worst Idea Tee");
    expect(html).toContain("$24.99");
    expect(html).toContain("Sunshine");
  });
  it("shows the personalization on a personalized line", () => {
    const { html } = buildCustomerEmail(
      data({
        items: [line({ cleantimeMode: "year_clean", cleantimeValue: 2019 })],
      }),
    );
    expect(html).toContain("Clean since 2019");
  });
});

describe("buildFounderEmail", () => {
  it("flags manual orders as action-needed", () => {
    const { subject, html } = buildFounderEmail(data(), {
      method: "manual",
      dropshipOrderId: null,
    });
    expect(subject).toContain("ACTION NEEDED");
    expect(html).toContain("by hand");
  });
  it("marks auto orders as submitted and shows the Printify id", () => {
    const { subject, html } = buildFounderEmail(data(), {
      method: "auto",
      dropshipOrderId: "po_999",
    });
    expect(subject).toContain("auto-submitted");
    expect(html).toContain("po_999");
  });
});

describe("sendEmail", () => {
  it("skips (returns false) when not configured", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const ok = await sendEmail({} as Env, {
      to: "x@y.com",
      subject: "s",
      html: "<p>h</p>",
    });
    expect(ok).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("POSTs to Resend with auth and returns true on 2xx", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    const env = {
      RESEND_API_KEY: "re_test",
      EMAIL_FROM: "orders@vvsstyles.com",
    } as Env;

    const ok = await sendEmail(env, {
      to: "buyer@example.com",
      subject: "hi",
      html: "<p>hi</p>",
    });

    expect(ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer re_test",
    );
    expect(JSON.parse(init.body as string)).toMatchObject({
      from: "orders@vvsstyles.com",
      to: "buyer@example.com",
      subject: "hi",
    });
  });

  it("returns false on a non-2xx response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("bad", { status: 422 }),
    );
    const env = { RESEND_API_KEY: "re_test", EMAIL_FROM: "x@y.com" } as Env;
    expect(
      await sendEmail(env, { to: "a@b.com", subject: "s", html: "h" }),
    ).toBe(false);
  });
});
