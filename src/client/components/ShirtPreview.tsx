import type { CleantimeMode } from "../../shared/types";
import { formatCleanTime } from "../lib/cart";

/**
 * Live preview of the chosen shirt. Phase 4 (2026-06-16): shows the real
 * product photo for the selected color (a Printify mockup), so the printed
 * phrase is part of the image — we no longer fake it with overlaid text.
 *
 * The clean-time value can't be baked into a static mockup (it's personalized
 * per order and finalized by hand at the provider), so for personalized
 * designs we surface it honestly as a caption beneath the photo instead of
 * pasting text onto a photo of a shirt on a body.
 */
export function ShirtPreview({
  imageUrl,
  phrase,
  colorName,
  cleantimeMode,
  cleantimeValue,
}: {
  imageUrl: string;
  phrase: string;
  colorName: string;
  cleantimeMode: CleantimeMode;
  cleantimeValue: number;
}) {
  const cleanTime = formatCleanTime(cleantimeMode, cleantimeValue);
  const personalizable = cleantimeMode !== "none";

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-stone-200 bg-stone-100 shadow-sm">
        <img
          src={imageUrl}
          alt={`${phrase} shirt in ${colorName}`}
          className="h-full w-full object-cover"
        />
      </div>

      {personalizable && (
        <p
          className="mt-3 font-sans text-sm text-stone-600"
          aria-live="polite"
        >
          {cleanTime ? (
            <>
              Personalized for you:{" "}
              <span className="font-medium text-emerald-800">{cleanTime}</span>
            </>
          ) : (
            "Enter your clean time above to personalize this shirt."
          )}
        </p>
      )}
    </div>
  );
}
