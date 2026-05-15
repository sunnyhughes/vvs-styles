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
            Milestone tees in your program&rsquo;s language. Pick your colors,
            add your cleantime, and wear your pride out loud — shirts from $28.
          </p>
          <Link
            to="/shop"
            className={`${buttonClassName("primary")} mt-6`}
          >
            Shop the collection
          </Link>
        </div>

        {/* TODO: replace with a real faceless lifestyle photo of someone
            wearing a shirt with a strong insider phrase (DESIGN §2 + §7 —
            hero photography is a hard launch dependency). */}
        <div className="flex aspect-[4/5] items-center justify-center rounded-md border border-stone-200 bg-stone-100 p-8 shadow-sm">
          <p className="text-center">
            <span className="font-display text-3xl text-emerald-800">
              &ldquo;Still Here, Still Clean&rdquo;
            </span>
            <span className="mt-2 block font-sans text-sm text-stone-500">
              photo placeholder
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
