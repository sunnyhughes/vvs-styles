import { Link } from "react-router-dom";
import type { Shirt } from "../../shared/types";
import { formatPriceUsd } from "../lib/api";

/** A single product card in the `/shop` grid. */
export function ShirtCard({ shirt }: { shirt: Shirt }) {
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
      <h3 className="mt-2 font-display text-2xl text-emerald-800">
        {shirt.name}
      </h3>
      <p className="font-sans text-base text-stone-700">
        {formatPriceUsd(shirt.base_price_cents)}
      </p>
    </Link>
  );
}
