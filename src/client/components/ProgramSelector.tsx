import { Label, Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { Program } from "../../shared/types";

const optionClass =
  "flex cursor-pointer items-center justify-between rounded-md border border-stone-200 bg-stone-50 px-4 py-3 font-sans text-base text-stone-700 transition-colors hover:bg-stone-100 data-[checked]:border-emerald-800 data-[checked]:bg-emerald-50 data-[checked]:text-emerald-900 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-emerald-800 data-[focus]:ring-offset-2";

/** Recovery-program picker — Headless UI `RadioGroup` of stacked options. */
export function ProgramSelector({
  programs,
  value,
  onChange,
}: {
  programs: Program[];
  value: Program | null;
  onChange: (program: Program) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onChange={(program: Program | null) => {
        if (program) onChange(program);
      }}
      className="flex flex-col gap-2"
    >
      <Label className="font-display text-lg text-emerald-800">Program</Label>
      {programs.map((program) => (
        <Radio key={program.id} value={program} className={optionClass}>
          {({ checked }) => (
            <>
              <span>{program.name}</span>
              {checked && (
                <CheckCircleIcon
                  className="h-5 w-5 text-emerald-800"
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </Radio>
      ))}
    </RadioGroup>
  );
}
