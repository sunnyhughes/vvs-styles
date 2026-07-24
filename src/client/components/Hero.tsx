import { Link } from "react-router-dom";
import { buttonClassName } from "./Button";

/** Landing-page hero: credibility line, headline, price, single CTA. */
export function Hero() {
  return (
    <section className="bg-stone-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <p className="font-sans text-sm font-medium uppercase tracking-wide text-orange-700">
            Made in recovery, for people in recovery
          </p>
          <h1 className="mt-3 font-display text-5xl leading-tight text-emerald-800">
            Wear the words only we would say.
          </h1>
          <p className="mt-4 font-sans text-lg text-stone-700">
            Milestone tees in your recovery journey&rsquo;s language. Pick your
            colors, add your clean time where it applies, and wear your pride out
            loud — starting at $24.99 for a limited time.
          </p>
          <Link
            to="/shop"
            className={`${buttonClassName("primary")} mt-6`}
          >
            Shop the collection
          </Link>
        </div>

        <div className="overflow-hidden rounded-md border border-stone-200 bg-stone-100 shadow-sm">
          <img
            src="/shirts/still-here-still-clean-red-lifestyle.png"
            alt="A smiling woman wearing the red Still Here, Still Clean recovery tee"
            className="aspect-[4/5] w-full object-cover object-top"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
