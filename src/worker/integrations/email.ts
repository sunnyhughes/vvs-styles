import type { Env } from "../types";

/**
 * Transactional email via Resend's HTTP API. Workers can't open SMTP sockets,
 * so we POST to https://api.resend.com/emails over fetch — no SDK/npm dep.
 *
 * Every send is BEST-EFFORT: a missing key or a non-2xx response is logged and
 * returns false rather than throwing. The caller (order confirm) has already
 * taken the customer's money, so an email hiccup must never fail that request.
 */
interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(env: Env, args: SendArgs): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.warn("email skipped: RESEND_API_KEY / EMAIL_FROM not configured");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: args.to,
        subject: args.subject,
        html: args.html,
      }),
    });
    if (!res.ok) {
      console.error("resend send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("resend send error", err);
    return false;
  }
}

// ── Email content ──────────────────────────────────────────────────────────

export interface EmailLine {
  shirtName: string;
  color: string;
  size: string;
  qty: number;
  cleantimeMode: "none" | "years" | "year_clean";
  cleantimeValue: number;
  unitPriceCents: number;
}

export interface OrderEmailData {
  orderId: string;
  email: string;
  shippingName: string;
  shippingAddress: string; // pre-formatted single block
  totalCents: number;
  items: EmailLine[];
}

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** Short, friendly order reference (first 8 of the UUID), upper-cased. */
export const shortRef = (orderId: string) =>
  orderId.replace(/-/g, "").slice(0, 8).toUpperCase();

/** Human label for a line's personalization, or null when it's a plain design. */
export function cleantimeLabel(
  mode: EmailLine["cleantimeMode"],
  value: number,
): string | null {
  if (mode === "years") {
    const v = Number.isInteger(value) ? String(value) : value.toFixed(1);
    return `${v} year${value === 1 ? "" : "s"} clean`;
  }
  if (mode === "year_clean") return `Clean since ${Math.round(value)}`;
  return null;
}

function lineRows(items: EmailLine[]): string {
  return items
    .map((it) => {
      const personal = cleantimeLabel(it.cleantimeMode, it.cleantimeValue);
      const detail = `${it.color} · ${it.size}${personal ? ` · ${personal}` : ""}`;
      return `<tr>
        <td style="padding:6px 0;">${it.qty}× <strong>${it.shirtName}</strong><br>
          <span style="color:#57534e;font-size:13px;">${detail}</span></td>
        <td style="padding:6px 0;text-align:right;">${money(it.unitPriceCents * it.qty)}</td>
      </tr>`;
    })
    .join("");
}

/** Customer-facing "thank you, order confirmed" email. */
export function buildCustomerEmail(data: OrderEmailData): {
  subject: string;
  html: string;
} {
  const ref = shortRef(data.orderId);
  return {
    subject: `Your vv-styles order ${ref} is confirmed`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1c1917;">
      <h1 style="color:#065f46;font-size:22px;">Thank you, ${data.shippingName.split(" ")[0]} 💚</h1>
      <p>Your order <strong>${ref}</strong> is confirmed and headed to print. Every shirt is made to order, so expect it to ship in about <strong>5–7 business days</strong>, with delivery a few days after that.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${lineRows(data.items)}
        <tr><td style="border-top:1px solid #e7e5e4;padding-top:8px;"><strong>Total</strong></td>
            <td style="border-top:1px solid #e7e5e4;padding-top:8px;text-align:right;"><strong>${money(data.totalCents)}</strong></td></tr>
      </table>
      <p style="color:#57534e;font-size:13px;">Shipping to:<br>${data.shippingAddress.replace(/\n/g, "<br>")}</p>
      <p>Questions about your order? Just reply to this email.</p>
      <p style="color:#065f46;">Keep coming back. — vv-styles</p>
    </div>`,
  };
}

/**
 * Internal alert to the founder. For the auto path it's a heads-up ("already
 * sent to Printify"); for the manual path it's an action item with everything
 * needed to place the order by hand — including the buyer's personalization.
 */
export function buildFounderEmail(
  data: OrderEmailData,
  opts: { method: "auto" | "manual"; dropshipOrderId?: string | null },
): { subject: string; html: string } {
  const ref = shortRef(data.orderId);
  const manual = opts.method === "manual";
  return {
    subject: manual
      ? `⚠️ ACTION NEEDED — place order ${ref} in Printify`
      : `✓ Order ${ref} auto-submitted to Printify`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#1c1917;">
      <h2 style="color:${manual ? "#b45309" : "#065f46"};">${
        manual
          ? "Place this order in Printify by hand"
          : "Auto-submitted to Printify"
      }</h2>
      <p><strong>Order ${ref}</strong> · ${money(data.totalCents)} · ${data.email}${
        opts.dropshipOrderId
          ? `<br>Printify order id: <code>${opts.dropshipOrderId}</code>`
          : ""
      }</p>
      ${manual ? '<p style="color:#b45309;">Includes a personalized design — set the buyer\'s clean-date in Printify before submitting.</p>' : ""}
      <table style="width:100%;border-collapse:collapse;margin:12px 0;">
        ${lineRows(data.items)}
      </table>
      <p style="color:#57534e;font-size:13px;"><strong>Ship to:</strong><br>${data.shippingName}<br>${data.shippingAddress.replace(/\n/g, "<br>")}</p>
    </div>`,
  };
}
