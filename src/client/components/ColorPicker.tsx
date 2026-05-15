import { Label, Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { Color } from "../../shared/types";

const optionClass =
  "flex cursor-pointer items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 font-sans text-sm text-stone-700 transition-colors hover:bg-stone-100 data-[checked]:border-emerald-800 data-[checked]:bg-emerald-50 data-[checked]:text-emerald-900 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-emerald-800 data-[focus]:ring-offset-2";

/**
 * Shirt-color picker — Headless UI `RadioGroup` of swatches. The color name is
 * always shown as text so color is never the only signal (DESIGN §5).
 */
export function ColorPicker({
  colors,
  value,
  onChange,
}: {
  colors: Color[];
  value: Color | null;
  onChange: (color: Color) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onChange={(color: Color | null) => {
        if (color) onChange(color);
      }}
      className="flex flex-col gap-2"
    >
      <Label className="font-display text-lg text-emerald-800">Color</Label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <Radio key={color.id} value={color} className={optionClass}>
            {({ checked }) => (
              <>
                <span
                  className="h-5 w-5 rounded-full border border-stone-300"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span>{color.name}</span>
                {checked && (
                  <CheckIcon
                    className="h-4 w-4 text-emerald-800"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}
