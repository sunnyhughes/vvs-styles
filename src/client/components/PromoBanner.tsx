import { promo } from "../content/promo";

/**
 * Site-wide launch-pricing banner: a slow horizontal marquee.
 *
 * The scrolling is purely decorative, so the visual track is `aria-hidden` and
 * paired with a single screen-reader copy of the message (avoids reading the
 * repeated text over and over). Honors `prefers-reduced-motion` via
 * `motion-reduce:animate-none` — the text then simply sits still, still legible.
 */
export function PromoBanner() {
  const { bannerText } = promo;
  // Two identical halves so the -50% marquee loops seamlessly; several copies
  // per half so the track overfills even wide viewports.
  const halves = [0, 1];
  const copiesPerHalf = [0, 1, 2, 3];

  return (
    <aside
      aria-label="Announcement"
      className="overflow-hidden bg-emerald-800 text-stone-50"
    >
      {/* One clean copy for assistive tech; the visual track below is decorative. */}
      <p className="sr-only">{bannerText}</p>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee py-2 motion-reduce:animate-none"
      >
        {halves.map((half) => (
          <div key={half} className="flex shrink-0">
            {copiesPerHalf.map((i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                <span className="mx-8 font-sans text-sm font-medium tracking-wide">
                  {bannerText}
                </span>
                <span className="text-emerald-300">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
