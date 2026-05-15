import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { CleanTimeInput } from "../../src/client/components/CleanTimeInput";

/** Stateful wrapper so typed input is reflected back into the field. */
function Harness() {
  const [value, setValue] = useState("");
  return <CleanTimeInput value={value} onChange={setValue} />;
}

describe("CleanTimeInput", () => {
  it("has an associated visible label", () => {
    render(<Harness />);
    expect(screen.getByLabelText(/clean time/i)).toBeInTheDocument();
  });

  it("accepts a numeric value typed by the user", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText(/clean time/i);
    await user.type(input, "3.5");
    expect(input).toHaveValue(3.5);
  });

  it("exposes its helper text as an accessible description", () => {
    render(<Harness />);
    expect(screen.getByLabelText(/clean time/i)).toHaveAccessibleDescription(
      /print on your shirt/i,
    );
  });
});
