import { Link } from "react-router-dom";
import { buttonClassName } from "../components/Button";
import { formatPriceUsd } from "../lib/api";
import {
  cartSubtotalCents,
  formatCleanTime,
  removeFromCart,
  updateQty,
  useCart,
} from "../lib/cart";

/** The `/cart` review page — full line-item list with quantity controls. */
export function Cart() {
  const items = useCart();
  const subtotal = cartSubtotalCents(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-emerald-800">Your cart</h1>
        <p className="mt-3 font-sans text-base text-stone-700">
          Your cart is empty.
        </p>
        <Link to="/shop" className={`${buttonClassName("primary")} mt-6`}>
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl text-emerald-800">Your cart</h1>

      <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
        {items.map((item) => {
          const cleanTime = formatCleanTime(
            item.cleantimeMode,
            item.cleantimeValue,
          );
          return (
            <li
              key={item.lineId}
              className="flex flex-wrap items-start gap-4 py-4"
            >
              <div className="flex-1">
                <p className="font-display text-2xl text-emerald-800">
                  {item.name}
                </p>
                <p className="mt-1 font-sans text-sm text-stone-500">
                  {item.color} &middot; {item.size}
                  {cleanTime ? ` · ${cleanTime}` : ""}
                </p>
                <p className="mt-1 font-sans text-base text-stone-700">
                  {formatPriceUsd(item.unitPriceCents)} each
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor={`qty-${item.lineId}`} className="sr-only">
                  Quantity for {item.name}
                </label>
                <input
                  id={`qty-${item.lineId}`}
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.lineId, Number(e.target.value))
                  }
                  className="w-16 rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-sans text-base text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(item.lineId)}
                  className="rounded-md px-2 py-1 font-sans text-sm text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
                >
                  Remove
                </button>
              </div>

              <p className="w-full text-right font-sans text-base font-medium text-stone-700 sm:w-auto">
                {formatPriceUsd(item.unitPriceCents * item.qty)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-2xl text-emerald-800">Subtotal</span>
        <span className="font-sans text-2xl font-medium text-stone-700">
          {formatPriceUsd(subtotal)}
        </span>
      </div>

      <Link
        to="/checkout"
        className={`${buttonClassName("primary")} mt-6 w-full`}
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
