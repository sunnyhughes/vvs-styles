import { Fragment } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "../components/Button";
import { aboutHero, aboutSections, founderNote } from "../content/about";

/**
 * The founder's own words, set apart from the page's "we" voice and signed
 * without a name — the brand's anonymity is deliberate (see content/about.ts).
 */
function FounderNote() {
  return (
    <blockquote className="rounded-md border-l-4 border-orange-700 bg-stone-50 py-6 pl-6 pr-4">
      {founderNote.body.map((paragraph, i) => (
        <p
          key={i}
          className="mt-3 font-sans text-base leading-relaxed text-stone-700 first:mt-0"
        >
          {paragraph}
        </p>
      ))}
      <footer className="mt-4 font-sans text-sm text-stone-500">
        {founderNote.attribution}
      </footer>
    </blockquote>
  );
}

/** The `/about` founder-story page. */
export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <p className="font-sans text-sm font-medium uppercase tracking-wide text-orange-700">
          {aboutHero.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-emerald-800">
          {aboutHero.heading}
        </h1>
        <p className="mt-4 font-sans text-lg text-stone-700">
          {aboutHero.lede}
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {aboutSections.map((section, index) => (
          <Fragment key={section.heading}>
            <section>
              <h2 className="font-display text-3xl text-emerald-800">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-3 font-sans text-base leading-relaxed text-stone-700"
                >
                  {paragraph}
                </p>
              ))}
            </section>
            {/* The personal "why" answers the section it follows. */}
            {index === 0 && <FounderNote />}
          </Fragment>
        ))}
      </div>

      <div className="mt-12">
        <Link to="/shop" className={buttonClassName("primary")}>
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
