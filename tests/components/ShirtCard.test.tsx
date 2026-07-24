import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ShirtCard } from "../../src/client/components/ShirtCard";
import type { ShirtSummary } from "../../src/shared/types";

const fixture: ShirtSummary = {
  id: 1,
  slug: "still-here",
  name: "Still Here Tee",
  base_price_cents: 2800,
  default_image_url: "/placeholder-shirt.svg",
  hero_phrase: "Still Here, Still Clean",
  colors: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#111111" },
  ],
};

function renderCard(shirt: ShirtSummary) {
  return render(
    <MemoryRouter>
      <ShirtCard shirt={shirt} />
    </MemoryRouter>,
  );
}

describe("ShirtCard", () => {
  it("renders the shirt name", () => {
    renderCard(fixture);
    expect(screen.getByText("Still Here Tee")).toBeInTheDocument();
  });

  it("shows the price formatted as US dollars", () => {
    renderCard(fixture);
    expect(screen.getByText("$28.00")).toBeInTheDocument();
  });

  it("links to the shirt's product page", () => {
    renderCard(fixture);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/product/still-here",
    );
  });

  it("hints at the available colors with labelled swatches", () => {
    const { container } = renderCard(fixture);
    expect(
      screen.getByRole("list", { name: /available in 2 colors/i }),
    ).toBeInTheDocument();
    // One swatch per color, tinted to its hex.
    const swatches = container.querySelectorAll("li");
    expect(swatches).toHaveLength(2);
    expect(swatches[0]).toHaveStyle({ backgroundColor: "#FFFFFF" });
  });
});
