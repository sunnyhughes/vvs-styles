import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FAQ } from "../../src/client/pages/FAQ";
import { faqItems } from "../../src/client/content/faq";

describe("FAQ", () => {
  it("renders a disclosure button for every FAQ item", () => {
    render(<FAQ />);
    for (const item of faqItems) {
      expect(
        screen.getByRole("button", { name: new RegExp(item.q, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("keeps answers collapsed until their question is activated", async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    // Returns answer is hidden until the question is opened.
    const returnsCopy = /free replacement/i;
    expect(screen.queryByText(returnsCopy)).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /return policy/i }),
    );
    expect(screen.getByText(returnsCopy)).toBeInTheDocument();
  });
});
