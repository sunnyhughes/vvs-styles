import { Link } from "react-router-dom";
import type { ShirtSummary } from "../../shared/types";
import { formatPriceUsd } from "../lib/api";

/** A single product card in the `/shop` grid. */
export function ShirtCard({ shirt }: { shirt: ShirtSummary }) {
  return (
    <Link
      to={`/product/${shirt.slug}`}
      className="group block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
    >
      <div className="relative overflow-hidden rounded-md border border-stone-200 bg-stone-100 shadow-sm">
        <img
          src={shirt.default_image_url}
          alt={shirt.hero_phrase}
          className="aspect-square w-full object-cover"
        />
      </div>
      <h2 className="mt-2 font-display text-2xl text-emerald-800">
        {shirt.name}
      </h2>
      {shirt.colors.length > 0 && (
        <ul
          className="mt-1.5 flex flex-wrap items-center gap-1.5"
          aria-label={`Available in ${shirt.colors.length} color${
            shirt.colors.length === 1 ? "" : "s"
          }`}
        >
          {shirt.colors.map((color) => (
            <li
              key={color.name}
              title={color.name}
              aria-hidden="true"
              className="h-4 w-4 rounded-full border border-stone-300 shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </ul>
      )}
      <p className="mt-1 font-sans text-base text-stone-700">
        {formatPriceUsd(shirt.base_price_cents)}
      </p>
    </Link>
  );
}
