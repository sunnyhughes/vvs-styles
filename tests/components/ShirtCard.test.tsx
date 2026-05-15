import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ShirtCard } from "../../src/client/components/ShirtCard";
import type { Shirt } from "../../src/shared/types";

const fixture: Shirt = {
  id: 1,
  slug: "still-here",
  name: "Still Here Tee",
  base_price_cents: 2800,
  default_image_url: "/placeholder-shirt.svg",
  hero_phrase: "Still Here, Still Clean",
};

function renderCard(shirt: Shirt) {
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
});
