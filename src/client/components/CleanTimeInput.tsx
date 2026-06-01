import type { CleantimeMode } from "../../shared/types";

/**
 * Labeled numeric input for the buyer's customization slot. Two modes:
 *   'years'      → "3.5" → printed as "3.5 Years Clean"
 *   'year_clean' → "1953" → printed as "Since 1953"
 *
 * Callers should not render this component when the shirt's mode is 'none'.
 */
export function CleanTimeInput({
  mode,
  value,
  onChange,
}: {
  mode: Exclude<CleantimeMode, "none">;
  value: string;
  onChange: (value: string) => void;
}) {
  const isYearClean = mode === "year_clean";
  const label = isYearClean ? "Year you got clean" : "Clean time";
  const placeholder = isYearClean ? "2020" : "3.5";
  const helper = isYearClean
    ? "The year you got clean — this is what we print on your shirt. Leave it blank to skip it."
    : "Years clean — this is what we print on your shirt. Leave it blank to skip it.";

  return (
    <div>
      <label
        htmlFor="clean-time"
        className="font-display text-lg text-emerald-800"
      >
        {label}
      </label>
      <input
        id="clean-time"
        name="clean-time"
        type="number"
        inputMode={isYearClean ? "numeric" : "decimal"}
        min={isYearClean ? 1900 : 0}
        step={isYearClean ? 1 : 0.5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-describedby="clean-time-help"
        className="mt-2 w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 font-sans text-base text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
      />
      <p id="clean-time-help" className="mt-1 font-sans text-sm text-stone-500">
        {helper}
      </p>
    </div>
  );
}
