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

/**
 * Live preview of the customized shirt. The simplest approach per DESIGN §7:
 * a colored panel with the phrase and clean time as overlaid text. Swap for
 * real layered product mockups once photography exists.
 */
export function ShirtPreview({
  phrase,
  colorHex,
  colorName,
  cleanTimeYears,
}: {
  phrase: string;
  colorHex: string;
  colorName: string;
  cleanTimeYears: number;
}) {
  const cleanTime = formatCleanTime(cleanTimeYears);
  const textColor = isLightHex(colorHex) ? "text-stone-900" : "text-stone-50";
  const label = `Preview: "${phrase}" shirt in ${colorName}${
    cleanTime ? `, ${cleanTime}` : ""
  }`;

  return (
    <div
      role="img"
      aria-label={label}
      className="flex aspect-square w-full flex-col items-center justify-center rounded-md border border-stone-200 p-8 text-center shadow-sm"
      style={{ backgroundColor: colorHex }}
    >
      <span className={`font-display text-2xl leading-snug ${textColor}`}>
        {phrase}
      </span>
      {cleanTime && (
        <span className={`mt-3 font-display text-xl ${textColor} opacity-90`}>
          {cleanTime}
        </span>
      )}
    </div>
  );
}
