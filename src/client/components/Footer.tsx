import { Link } from "react-router-dom";
import { socialLinks } from "../content/social";

const linkClass =
  "rounded-md font-sans text-sm text-stone-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2";

const socialClass =
  "rounded-full p-1 text-stone-500 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2";

/** Site-wide footer, shared across every route. */
export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <img
          src="/vvstyles-logo3.png"
          alt="vv-styles"
          className="h-16 w-auto"
          width={1050}
          height={600}
        />
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

        <nav className="mt-6 flex gap-2" aria-label="Social media">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className={socialClass}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </nav>

        <div className="mt-8 flex items-center gap-3">
          {/* Decorative — the text beside it already names Esoh Creations. */}
          <img
            src="/esoh-logo.png"
            alt=""
            aria-hidden="true"
            className="h-10 w-auto"
            width={500}
            height={500}
          />
          <p className="font-sans text-xs text-stone-500">
            &copy; 2026 vv-styles, a venture of Esoh Creations LLC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
