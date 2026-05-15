import { Link } from "react-router-dom";

const linkClass =
  "rounded-md font-sans text-sm text-stone-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2";

/** Site-wide footer, shared across every route. */
export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-display text-xl text-emerald-800">vvs-styles</p>
        <p className="mt-1 font-sans text-sm text-stone-500">
          Made in recovery, for people in recovery.
        </p>
        <nav
          className="mt-4 flex flex-wrap gap-x-6 gap-y-2"
          aria-label="Footer"
        >
          <Link to="/shop" className={linkClass}>
            Shop
          </Link>
          <Link to="/about" className={linkClass}>
            About
          </Link>
          <Link to="/faq" className={linkClass}>
            FAQ
          </Link>
        </nav>
        <p className="mt-8 font-sans text-xs text-stone-500">
          &copy; 2026 vvs-styles. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
