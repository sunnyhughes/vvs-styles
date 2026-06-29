import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Color, ShirtDetail } from "../../shared/types";
import { AddToCartButton } from "../components/AddToCartButton";
import { CleanTimeInput } from "../components/CleanTimeInput";
import { ColorPicker } from "../components/ColorPicker";
import { ShirtPreview } from "../components/ShirtPreview";
import { SizeSelector, type Size } from "../components/SizeSelector";
import { formatPriceUsd, getShirt } from "../lib/api";
import type { NewCartItem } from "../lib/cart";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; shirt: ShirtDetail };

/** The `/product/:slug` detail page with the customization flow. */
export function Product() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  // Color defaults to the first option so the preview renders immediately.
  const [color, setColor] = useState<Color | null>(null);
  const [size, setSize] = useState<Size>("M");
  const [cleanTime, setCleanTime] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setState({ status: "loading" });
    getShirt(slug)
      .then((shirt) => {
        if (cancelled) return;
        setState({ status: "ready", shirt });
        setColor(shirt.colors[0] ?? null);
        setCleanTime("");
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <p className="mx-auto max-w-6xl px-4 py-20 font-sans text-base text-stone-500">
        Loading&hellip;
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <p
        role="alert"
        className="mx-auto max-w-6xl px-4 py-20 font-sans text-base text-red-700"
      >
        We couldn&rsquo;t load this shirt. Please refresh to try again.
      </p>
    );
  }

  const { shirt } = state;
  const cleantimeValue = Number(cleanTime) > 0 ? Number(cleanTime) : 0;

  // The selected color's real photo, falling back to the catalog thumbnail
  // until a per-color mockup has been uploaded for this combo.
  const colorImage = color?.image_url ?? shirt.default_image_url;

  const item: NewCartItem | null = color
    ? {
        slug: shirt.slug,
        name: shirt.name,
        unitPriceCents: shirt.base_price_cents,
        imageUrl: colorImage,
        color: color.name,
        colorHex: color.hex,
        size,
        cleantimeMode: shirt.cleantime_mode,
        cleantimeValue,
      }
    : null;

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 rounded-md font-sans text-sm text-stone-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to shop
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 lg:grid lg:grid-cols-2 lg:gap-10">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ShirtPreview
          imageUrl={colorImage}
          phrase={shirt.hero_phrase}
          colorName={color?.name ?? "White"}
          cleantimeMode={shirt.cleantime_mode}
          cleantimeValue={cleantimeValue}
        />
      </div>

      <div className="mt-8 lg:mt-0">
        <h1 className="font-display text-3xl text-emerald-800">{shirt.name}</h1>
        <p className="mt-1 font-sans text-lg text-stone-700">
          {formatPriceUsd(shirt.base_price_cents)}
        </p>

        <div className="mt-6 flex flex-col gap-6">
          <ColorPicker
            colors={shirt.colors}
            value={color}
            onChange={setColor}
          />
          {shirt.cleantime_mode !== "none" && (
            <CleanTimeInput
              mode={shirt.cleantime_mode}
              value={cleanTime}
              onChange={setCleanTime}
            />
          )}
          <SizeSelector value={size} onChange={setSize} />
        </div>

        <div className="mt-8">
          <AddToCartButton item={item} disabled={!item} />
        </div>
      </div>
      </div>
    </>
  );
}
