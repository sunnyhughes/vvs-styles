import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import { Button } from "./Button";

/**
 * Wraps Stripe's hosted `<PaymentElement>` widget. The Element auto-renders
 * whichever methods are enabled in the Stripe dashboard — card today, Cash
 * App Pay / Apple / Google Pay automatically when toggled on.
 */
export function StripeCheckout({
  publishableKey,
  clientSecret,
  orderId,
}: {
  publishableKey: string;
  clientSecret: string;
  orderId: string;
}) {
  // loadStripe is cached internally; memoizing the promise across renders
  // keeps Elements from re-mounting if the parent re-renders.
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey],
  );

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <PaymentForm orderId={orderId} />
    </Elements>
  );
}

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/confirmation/${orderId}`,
      },
    });

    // On success, Stripe redirects the browser to return_url before this code
    // resumes — only the error branch runs in-page.
    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && (
        <p role="alert" className="font-sans text-sm text-red-700">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full"
      >
        {submitting ? "Processing…" : "Pay now"}
      </Button>
    </form>
  );
}
