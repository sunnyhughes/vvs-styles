import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ProgramSelector } from "../../src/client/components/ProgramSelector";
import type { Program } from "../../src/shared/types";

const programs: Program[] = [
  { id: 1, slug: "aa", name: "Alcoholics Anonymous" },
  { id: 2, slug: "na", name: "Narcotics Anonymous" },
  { id: 3, slug: "anger-management", name: "Anger Management" },
];

/** Stateful wrapper so a selection actually sticks during the test. */
function Harness() {
  const [value, setValue] = useState<Program | null>(null);
  return (
    <ProgramSelector programs={programs} value={value} onChange={setValue} />
  );
}

describe("ProgramSelector", () => {
  it("renders every program as a radio option", () => {
    render(<Harness />);
    const group = screen.getByRole("radiogroup", { name: /program/i });
    expect(within(group).getAllByRole("radio")).toHaveLength(3);
  });

  it("selects a program when clicked", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const radio = screen.getByRole("radio", { name: "Narcotics Anonymous" });
    await user.click(radio);
    expect(radio).toBeChecked();
  });

  it("is operable with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.tab(); // focus moves to the first radio
    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("radio", { name: "Narcotics Anonymous" }),
    ).toBeChecked();
  });
});
