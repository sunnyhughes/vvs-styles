import { Bars3Icon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MobileNavDrawer } from "./MobileNavDrawer";

const desktopLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

const iconButtonClass =
  "rounded-full p-2 text-stone-700 hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2";

/** Fixed top navigation bar: inline links on desktop, hamburger on mobile. */
export function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main"
      >
        <Link
          to="/"
          className="rounded-md font-display text-2xl text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
        >
          vvs-styles
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden items-center gap-6 md:flex">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md font-sans text-base ${
                    isActive ? "text-emerald-800" : "text-stone-700"
                  } hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <Link to="/cart" aria-label="Cart" className={iconButtonClass}>
            <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className={`${iconButtonClass} md:hidden`}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
