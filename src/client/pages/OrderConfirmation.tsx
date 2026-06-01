import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buttonClassName } from "../components/Button";
import { formatPriceUsd } from "../lib/api";
import { clearCart, formatCleanTime } from "../lib/cart";
import { confirmOrder, getOrder, type OrderResponse } from "../lib/checkout";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; order: OrderResponse }
  | { kind: "pending"; order: OrderResponse }
  | { kind: "error"; message: string };

/** Post-payment landing — Stripe redirects here with the order id. */
export function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    // Ask the worker to verify the Payment Intent with Stripe and flip the
    // order to 'paid'. The endpoint is idempotent — a reload runs it again
    // safely. We then re-fetch the order to get the post-confirm state.
    (async () => {
      try {
        await confirmOrder(id);
        const order = await getOrder(id);
        if (cancelled) return;
        if (order.status === "paid") {
          clearCart();
          setState({ kind: "ready", order });
        } else {
          setState({ kind: "pending", order });
        }
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            err instanceof Error
              ? err.message
              : "We couldn't confirm your order.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.kind === "loading") {
    return (
      <p className="mx-auto max-w-3xl px-4 py-20 font-sans text-base text-stone-500">
        Confirming your order&hellip;
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-emerald-800">
          We&rsquo;re still confirming your order
        </h1>
        <p
          role="alert"
          className="mt-3 font-sans text-base text-red-700"
        >
          {state.message}
        </p>
        <p className="mt-3 font-sans text-base text-stone-700">
          Your payment may still have succeeded. Please check your email — if
          you don&rsquo;t hear from us within a few minutes, reach out and
          we&rsquo;ll sort it out.
        </p>
      </div>
    );
  }

  const { order } = state;
  const isPending = state.kind === "pending";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl text-emerald-800">
        {isPending ? "Almost there" : "Thank you for your order"}
      </h1>
      <p className="mt-2 font-sans text-base text-stone-700">
        {isPending
          ? "Your payment is still processing. We'll email you the moment it clears."
          : `We sent a confirmation to ${order.email}. Your order will ship in 5–7 business days.`}
      </p>

      <p className="mt-4 font-sans text-sm text-stone-500">
        Order number: <span className="font-mono">{order.id}</span>
      </p>

      <h2 className="mt-8 font-display text-2xl text-emerald-800">
        Your order
      </h2>
      <ul className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
        {order.items.map((item, i) => {
          const cleanTime = formatCleanTime(
            item.cleantime_mode,
            item.cleantime_value,
          );
          return (
            <li key={i} className="flex flex-col gap-1 py-3">
              <p className="font-display text-lg text-emerald-800">
                {item.shirt_name}
              </p>
              <p className="font-sans text-sm text-stone-500">
                {item.color} &middot; {item.size}
                {cleanTime ? ` · ${cleanTime}` : ""}
              </p>
              <p className="font-sans text-sm text-stone-700">
                Qty {item.qty} &middot;{" "}
                {formatPriceUsd(item.unit_price_cents * item.qty)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-xl text-emerald-800">Total</span>
        <span className="font-sans text-xl font-medium text-stone-700">
          {formatPriceUsd(order.total_cents)}
        </span>
      </div>

      <h2 className="mt-10 font-display text-2xl text-emerald-800">
        Shipping to
      </h2>
      <address className="mt-2 font-sans text-base not-italic text-stone-700">
        {order.shipping_name}
        <br />
        {order.shipping_address_line1}
        {order.shipping_address_line2 ? (
          <>
            <br />
            {order.shipping_address_line2}
          </>
        ) : null}
        <br />
        {order.shipping_city}, {order.shipping_state}{" "}
        {order.shipping_postal_code}
        <br />
        {order.shipping_country}
      </address>

      <Link to="/shop" className={`${buttonClassName("secondary")} mt-8`}>
        Keep browsing
      </Link>
    </div>
  );
}
