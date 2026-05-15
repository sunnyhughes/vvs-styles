import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

/** Slide-over navigation drawer for mobile, sliding in from the right. */
export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 md:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-stone-900/40 transition-opacity duration-200 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-y-0 right-0 flex w-full max-w-xs">
        <DialogPanel
          transition
          className="flex w-full flex-col bg-stone-50 p-6 shadow-lg transition-transform duration-200 ease-out data-[closed]:translate-x-full"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-full p-2 text-stone-700 hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav
            className="mt-2 flex flex-col gap-1"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className="rounded-md px-2 py-3 font-display text-2xl text-emerald-800 hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-auto pt-8 font-sans text-sm text-stone-500">
            Made in recovery, for people in recovery.
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
