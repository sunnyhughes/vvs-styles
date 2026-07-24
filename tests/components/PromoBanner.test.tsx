import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PromoBanner } from "../../src/client/components/PromoBanner";
import { promo } from "../../src/client/content/promo";

describe("PromoBanner", () => {
  it("is a labelled announcement landmark", () => {
    render(<PromoBanner />);
    expect(
      screen.getByRole("complementary", { name: /announcement/i }),
    ).toBeInTheDocument();
  });

  it("exposes the promo message once for screen readers", () => {
    const { container } = render(<PromoBanner />);
    const srCopy = container.querySelector("p.sr-only");
    expect(srCopy).not.toBeNull();
    expect(srCopy).toHaveTextContent(promo.bannerText);
  });

  it("hides the animated track from assistive tech and halts on reduced motion", () => {
    const { container } = render(<PromoBanner />);
    const track = container.querySelector(".animate-marquee");
    expect(track).not.toBeNull();
    expect(track).toHaveAttribute("aria-hidden", "true");
    // Respects prefers-reduced-motion — the text sits static instead of scrolling.
    expect(track).toHaveClass("motion-reduce:animate-none");
  });
});
