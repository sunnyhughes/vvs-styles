import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { CleanTimeInput } from "../../src/client/components/CleanTimeInput";
import type { CleantimeMode } from "../../src/shared/types";

/** Stateful wrapper so typed input is reflected back into the field. */
function Harness({ mode }: { mode: Exclude<CleantimeMode, "none"> }) {
  const [value, setValue] = useState("");
  return <CleanTimeInput mode={mode} value={value} onChange={setValue} />;
}

describe("CleanTimeInput (years mode)", () => {
  it("has an associated visible label", () => {
    render(<Harness mode="years" />);
    expect(screen.getByLabelText(/clean time/i)).toBeInTheDocument();
  });

  it("accepts a numeric value typed by the user", async () => {
    const user = userEvent.setup();
    render(<Harness mode="years" />);
    const input = screen.getByLabelText(/clean time/i);
    await user.type(input, "3.5");
    expect(input).toHaveValue(3.5);
  });

  it("exposes its helper text as an accessible description", () => {
    render(<Harness mode="years" />);
    expect(screen.getByLabelText(/clean time/i)).toHaveAccessibleDescription(
      /print on your shirt/i,
    );
  });
});

describe("CleanTimeInput (year_clean mode)", () => {
  it("labels the input as the year the buyer got clean", () => {
    render(<Harness mode="year_clean" />);
    expect(screen.getByLabelText(/year you got clean/i)).toBeInTheDocument();
  });

  it("accepts a year typed by the user", async () => {
    const user = userEvent.setup();
    render(<Harness mode="year_clean" />);
    const input = screen.getByLabelText(/year you got clean/i);
    await user.type(input, "2020");
    expect(input).toHaveValue(2020);
  });
});
