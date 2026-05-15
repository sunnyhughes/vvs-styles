import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { formatPriceUsd } from "../lib/api";
import {
  cartSubtotalCents,
  closeCart,
  formatCleanTime,
  removeFromCart,
  useCart,
  useCartDrawerOpen,
} from "../lib/cart";

/** Slide-over cart drawer — opens on add-to-cart, panel from the right. */
export function CartDrawer() {
  const open = useCartDrawerOpen();
  const items = useCart();
  const subtotal = cartSubtotalCents(items);

  return (
    <Dialog open={open} onClose={closeCart} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-stone-900/40 transition-opacity duration-200 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-y-0 right-0 flex w-full max-w-sm">
        <DialogPanel
          transition
          className="flex w-full flex-col bg-stone-50 shadow-lg transition-transform duration-200 ease-out data-[closed]:translate-x-full"
        >
          <div className="flex items-center justify-between border-b border-stone-200 p-4">
            <DialogTitle className="font-display text-2xl text-emerald-800">
              Your cart
            </DialogTitle>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="rounded-full p-2 text-stone-700 hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="p-6 font-sans text-base text-stone-500">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex-1 divide-y divide-stone-200 overflow-y-auto">
              {items.map((item) => {
                const cleanTime = formatCleanTime(item.cleanTimeYears);
                return (
                  <li key={item.lineId} className="flex gap-3 p-4">
                    <div className="flex-1">
                      <p className="font-display text-lg text-emerald-800">
                        {item.name}
                      </p>
                      <p className="font-sans text-sm text-stone-500">
                        {item.program} &middot; {item.color} &middot; {item.size}
                        {cleanTime ? ` · ${cleanTime}` : ""}
                      </p>
                      <p className="font-sans text-sm text-stone-700">
                        Qty {item.qty} &middot;{" "}
                        {formatPriceUsd(item.unitPriceCents * item.qty)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.lineId)}
                      aria-label={`Remove ${item.name}`}
                      className="self-start rounded-md p-1 font-sans text-sm text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-stone-200 p-4">
            <div className="flex items-center justify-between font-sans text-base text-stone-700">
              <span>Subtotal</span>
              <span className="font-medium">{formatPriceUsd(subtotal)}</span>
            </div>
            <Link
              to="/cart"
              onClick={closeCart}
              className="mt-3 block rounded-md border border-emerald-800 px-4 py-2 text-center font-sans text-base font-medium text-emerald-800 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
            >
              View cart
            </Link>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
