import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

/** Available shirt sizes. Static — sizes don't vary per shirt in v1. */
export const SIZES = ["S", "M", "L", "XL", "2XL"] as const;
export type Size = (typeof SIZES)[number];

/** Size picker — Headless UI `Listbox` dropdown. */
export function SizeSelector({
  value,
  onChange,
}: {
  value: Size;
  onChange: (size: Size) => void;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <Label className="font-display text-lg text-emerald-800">Size</Label>
      <div className="relative mt-2">
        <ListboxButton className="flex w-full items-center justify-between rounded-md border border-stone-200 bg-stone-50 px-4 py-3 font-sans text-base text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2">
          <span>{value}</span>
          <ChevronUpDownIcon
            className="h-5 w-5 text-stone-500"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-stone-200 bg-stone-50 shadow-lg focus:outline-none">
          {SIZES.map((size) => (
            <ListboxOption
              key={size}
              value={size}
              className="flex cursor-pointer items-center justify-between px-4 py-2 font-sans text-base text-stone-700 data-[focus]:bg-emerald-50 data-[focus]:text-emerald-900"
            >
              {({ selected }) => (
                <>
                  <span>{size}</span>
                  {selected && (
                    <CheckIcon
                      className="h-4 w-4 text-emerald-800"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
