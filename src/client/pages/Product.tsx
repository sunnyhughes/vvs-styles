import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Color, Program, ShirtDetail } from "../../shared/types";
import { AddToCartButton } from "../components/AddToCartButton";
import { CleanTimeInput } from "../components/CleanTimeInput";
import { ColorPicker } from "../components/ColorPicker";
import { ProgramSelector } from "../components/ProgramSelector";
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

  // Customization selections. Program starts unset so the buyer makes a
  // deliberate choice; color/size default so the preview renders immediately.
  const [program, setProgram] = useState<Program | null>(null);
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
        setProgram(null);
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
  const cleanTimeYears = Number(cleanTime) > 0 ? Number(cleanTime) : 0;

  // Item is only buildable once the required options (program + color) are set.
  const item: NewCartItem | null =
    program && color
      ? {
          slug: shirt.slug,
          name: shirt.name,
          unitPriceCents: shirt.base_price_cents,
          imageUrl: shirt.default_image_url,
          program: program.name,
          color: color.name,
          colorHex: color.hex,
          size,
          cleanTimeYears,
        }
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:grid lg:grid-cols-2 lg:gap-10">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ShirtPreview
          phrase={shirt.hero_phrase}
          colorHex={color?.hex ?? "#F5F0E6"}
          colorName={color?.name ?? "Cream"}
          cleanTimeYears={cleanTimeYears}
        />
      </div>

      <div className="mt-8 lg:mt-0">
        <h1 className="font-display text-3xl text-emerald-800">{shirt.name}</h1>
        <p className="mt-1 font-sans text-lg text-stone-700">
          {formatPriceUsd(shirt.base_price_cents)}
        </p>

        <div className="mt-6 flex flex-col gap-6">
          <ProgramSelector
            programs={shirt.programs}
            value={program}
            onChange={setProgram}
          />
          <ColorPicker
            colors={shirt.colors}
            value={color}
            onChange={setColor}
          />
          <CleanTimeInput value={cleanTime} onChange={setCleanTime} />
          <SizeSelector value={size} onChange={setSize} />
        </div>

        <div className="mt-8">
          <AddToCartButton item={item} disabled={!item} />
          {!program && (
            <p className="mt-2 font-sans text-sm text-stone-500">
              Choose a program to add this shirt to your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
