import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShirtPreview } from "../../src/client/components/ShirtPreview";

describe("ShirtPreview", () => {
  it("shows the real product photo for the chosen color", () => {
    render(
      <ShirtPreview
        imageUrl="/shirts/still-here/black.png"
        phrase="Still Here, Still Clean"
        colorName="Black"
        cleantimeMode="none"
        cleantimeValue={0}
      />,
    );

    const img = screen.getByRole("img", {
      name: /still here, still clean shirt in black/i,
    });
    expect(img).toHaveAttribute("src", "/shirts/still-here/black.png");
  });

  it("surfaces the entered clean time as a caption for personalized designs", () => {
    render(
      <ShirtPreview
        imageUrl="/shirts/still-here/black.png"
        phrase="Still Here, Still Clean"
        colorName="Black"
        cleantimeMode="years"
        cleantimeValue={5}
      />,
    );

    expect(screen.getByText(/5 years clean/i)).toBeInTheDocument();
  });

  it("prompts for clean time when a personalized design has none entered yet", () => {
    render(
      <ShirtPreview
        imageUrl="/shirts/still-here/black.png"
        phrase="Still Here, Still Clean"
        colorName="Black"
        cleantimeMode="years"
        cleantimeValue={0}
      />,
    );

    expect(
      screen.getByText(/enter your clean time above to personalize/i),
    ).toBeInTheDocument();
  });

  it("shows no personalization caption for a non-personalized design", () => {
    render(
      <ShirtPreview
        imageUrl="/shirts/worst-idea/white.png"
        phrase="I Survived My Own Worst Idea"
        colorName="White"
        cleantimeMode="none"
        cleantimeValue={0}
      />,
    );

    expect(screen.queryByText(/personalize/i)).not.toBeInTheDocument();
  });
});
