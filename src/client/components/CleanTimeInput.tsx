/** Labeled numeric input for the buyer's clean time, in years. */
export function CleanTimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor="clean-time"
        className="font-display text-lg text-emerald-800"
      >
        Clean time
      </label>
      <input
        id="clean-time"
        name="clean-time"
        type="number"
        inputMode="decimal"
        min={0}
        step={0.5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="3.5"
        aria-describedby="clean-time-help"
        className="mt-2 w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 font-sans text-base text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
      />
      <p id="clean-time-help" className="mt-1 font-sans text-sm text-stone-500">
        Years clean — this is what we print on your shirt. Leave it blank to skip
        it.
      </p>
    </div>
  );
}
