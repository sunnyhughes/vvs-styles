import type { CleantimeMode } from "../../shared/types";
import { formatCleanTime } from "../lib/cart";

/**
 * Returns true when this background color is light enough that text on it
 * should be dark. Perceived luminance, ITU-R BT.601 weighting.
 */
function isLightHex(hex: string): boolean {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

// Tee silhouette path — matches public/placeholder-shirt.svg so the rendered
// preview tracks the same shape the catalog uses for thumbnails.
const TEE_PATH =
  "M150 88 L108 120 L78 96 L40 142 L80 182 L108 168 L108 324 L292 324 L292 168 L320 182 L360 142 L322 96 L292 120 L250 88 C236 112 164 112 150 88 Z";

/**
 * Live preview of the customized shirt. v1 polish (2026-06-01): a stand-in
 * tee silhouette filled with the chosen color, phrase + cleantime overlaid
 * on the chest area, optional accent graphic above the phrase. Swap the
 * silhouette for real provider mockups once Phase 4 picks a print supplier.
 */
export function ShirtPreview({
  phrase,
  colorHex,
  colorName,
  cleantimeMode,
  cleantimeValue,
  accentImageUrl,
}: {
  phrase: string;
  colorHex: string;
  colorName: string;
  cleantimeMode: CleantimeMode;
  cleantimeValue: number;
  accentImageUrl?: string | null;
}) {
  const cleanTime = formatCleanTime(cleantimeMode, cleantimeValue);
  const textColor = isLightHex(colorHex) ? "text-stone-900" : "text-stone-50";
  const label = `Preview: "${phrase}" shirt in ${colorName}${
    cleanTime ? `, ${cleanTime}` : ""
  }`;

  return (
    <div
      role="img"
      aria-label={label}
      className="relative aspect-square w-full overflow-hidden rounded-md border border-stone-200 bg-stone-50 shadow-sm"
    >
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        aria-hidden="true"
      >
        <path
          d={TEE_PATH}
          fill={colorHex}
          stroke="#166534"
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </svg>

      <div className="pointer-events-none absolute inset-x-[18%] inset-y-[28%] flex flex-col items-center justify-center text-center">
        {accentImageUrl && (
          <img src={accentImageUrl} alt="" className="mb-2 max-h-12 w-auto" />
        )}
        <span className={`font-display text-xl leading-snug ${textColor}`}>
          {phrase}
        </span>
        {cleanTime && (
          <span
            className={`mt-2 font-display text-base ${textColor} opacity-90`}
          >
            {cleanTime}
          </span>
        )}
      </div>

      <span className="absolute bottom-2 right-3 font-sans text-xs text-stone-400">
        stand-in
      </span>
    </div>
  );
}
