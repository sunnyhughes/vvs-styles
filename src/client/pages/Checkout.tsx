import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "../components/Button";
import { ShippingForm, type ShippingFormValue } from "../components/ShippingForm";
import { StripeCheckout } from "../components/StripeCheckout";
import { formatPriceUsd } from "../lib/api";
import {
  cartSubtotalCents,
  formatCleanTime,
  useCart,
} from "../lib/cart";
import {
  createPaymentIntent,
  getStripePublishableKey,
} from "../lib/checkout";

type Stage =
  | { kind: "collecting" }
  | { kind: "preparing" }
  | {
      kind: "paying";
      clientSecret: string;
      orderId: string;
      publishableKey: string;
    }
  | { kind: "error"; message: string };

/** The `/checkout` page — shipping form, then Stripe Payment Element. */
export function Checkout() {
  const items = useCart();
  const subtotal = cartSubtotalCents(items);
  const [stage, setStage] = useState<Stage>({ kind: "collecting" });
  const [publishableKey, setPublishableKey] = useState<string | null>(null);

  // Fetch the publishable key once on mount so the Element can mount the
  // moment the Payment Intent is created. Failures here are non-blocking
  // until the buyer tries to continue.
  useEffect(() => {
    let cancelled = false;
    getStripePublishableKey()
      .then((key) => {
        if (!cancelled) setPublishableKey(key);
      })
      .catch(() => {
        // Surfaced on submit if the key is still missing.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0 && stage.kind !== "paying") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-emerald-800">Checkout</h1>
        <p className="mt-3 font-sans text-base text-stone-700">
          Your cart is empty.
        </p>
        <Link to="/shop" className={`${buttonClassName("primary")} mt-6`}>
          Shop the collection
        </Link>
      </div>
    );
  }

  async function handleShippingSubmit(value: ShippingFormValue) {
    if (!publishableKey) {
      setStage({
        kind: "error",
        message:
          "Payment isn't configured yet. Please refresh and try again in a moment.",
      });
      return;
    }
    setStage({ kind: "preparing" });
    try {
      const { orderId, clientSecret } = await createPaymentIntent({
        items,
        shipping: value.shipping,
        email: value.email,
      });
      setStage({
        kind: "paying",
        clientSecret,
        orderId,
        publishableKey,
      });
    } catch (err) {
      setStage({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong preparing payment.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:grid lg:grid-cols-3 lg:gap-10">
      <div className="lg:col-span-2">
        <h1 className="font-display text-3xl text-emerald-800">Checkout</h1>

        {stage.kind === "collecting" && (
          <div className="mt-6">
            <ShippingForm onSubmit={handleShippingSubmit} submitting={false} />
          </div>
        )}

        {stage.kind === "preparing" && (
          <div className="mt-6">
            <ShippingForm
              onSubmit={() => {
                /* disabled while preparing */
              }}
              submitting
            />
          </div>
        )}

        {stage.kind === "paying" && (
          <div className="mt-6">
            <h2 className="font-display text-2xl text-emerald-800">Payment</h2>
            <p className="mt-1 font-sans text-sm text-stone-500">
              Card, Cash App, and other available methods will appear below.
            </p>
            <div className="mt-4">
              <StripeCheckout
                publishableKey={stage.publishableKey}
                clientSecret={stage.clientSecret}
                orderId={stage.orderId}
              />
            </div>
          </div>
        )}

        {stage.kind === "error" && (
          <div className="mt-6">
            <p
              role="alert"
              className="rounded-md border border-red-700 bg-red-50 p-3 font-sans text-base text-red-700"
            >
              {stage.message}
            </p>
            <button
              type="button"
              onClick={() => setStage({ kind: "collecting" })}
              className={`${buttonClassName("secondary")} mt-4`}
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <aside className="mt-10 lg:col-span-1 lg:mt-0">
        <h2 className="font-display text-2xl text-emerald-800">Order summary</h2>
        <ul className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
          {items.map((item) => {
            const cleanTime = formatCleanTime(
              item.cleantimeMode,
              item.cleantimeValue,
            );
            return (
              <li key={item.lineId} className="flex flex-col gap-1 py-3">
                <p className="font-display text-lg text-emerald-800">
                  {item.name}
                </p>
                <p className="font-sans text-sm text-stone-500">
                  {item.color} &middot; {item.size}
                  {cleanTime ? ` · ${cleanTime}` : ""}
                </p>
                <p className="font-sans text-sm text-stone-700">
                  Qty {item.qty} &middot;{" "}
                  {formatPriceUsd(item.unitPriceCents * item.qty)}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl text-emerald-800">Total</span>
          <span className="font-sans text-xl font-medium text-stone-700">
            {formatPriceUsd(subtotal)}
          </span>
        </div>
      </aside>
    </div>
  );
}
