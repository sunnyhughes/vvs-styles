import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ColorPicker } from "../../src/client/components/ColorPicker";
import type { Color } from "../../src/shared/types";

const colors: Color[] = [
  { id: 1, name: "Forest Green", hex: "#166534", image_url: null },
  { id: 2, name: "Navy", hex: "#1E3A5F", image_url: null },
  { id: 3, name: "Cream", hex: "#F5F0E6", image_url: null },
];

/** Stateful wrapper so a selection actually sticks during the test. */
function Harness() {
  const [value, setValue] = useState<Color | null>(null);
  return <ColorPicker colors={colors} value={value} onChange={setValue} />;
}

describe("ColorPicker", () => {
  it("renders every color with a visible name", () => {
    render(<Harness />);
    const group = screen.getByRole("radiogroup", { name: /color/i });
    expect(within(group).getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByText("Navy")).toBeInTheDocument();
  });

  it("selects a color when clicked", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const radio = screen.getByRole("radio", { name: /navy/i });
    await user.click(radio);
    expect(radio).toBeChecked();
  });

  it("is operable with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.tab(); // focus moves to the first radio
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: /navy/i })).toBeChecked();
  });
});
