import { Link } from "react-router-dom";
import { socialLinks } from "../content/social";

const linkClass =
  "rounded-md font-sans text-base text-stone-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 md:text-lg";

const socialClass =
  "rounded-full p-1.5 text-stone-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2";

/** Site-wide footer, shared across every route. Centered, roomier on desktop. */
export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 text-center md:py-16 lg:py-20">
        <img
          src="/vvstyles-logo3.png"
          alt="vv-styles"
          className="h-16 w-auto md:h-20 lg:h-24"
          width={1050}
          height={600}
        />
        <p className="mt-3 font-sans text-sm text-stone-500 md:text-base">
          Made in recovery, for people in recovery.
        </p>

        <nav
          className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2"
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

        <nav
          className="mt-6 flex justify-center gap-3 md:gap-4"
          aria-label="Social media"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className={`${socialClass} ${social.hoverClass}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 md:h-7 md:w-7"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </nav>

        <div className="mt-10 flex items-center justify-center gap-3">
          {/* Decorative — the text beside it already names Esoh Creations. */}
          <img
            src="/esoh-logo.png"
            alt=""
            aria-hidden="true"
            className="h-11 w-auto md:h-12"
            width={500}
            height={500}
          />
          <p className="font-sans text-xs text-stone-500 md:text-sm">
            &copy; 2026 vv-styles, a venture of Esoh Creations LLC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
