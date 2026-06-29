import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ShirtDetail } from "../../src/shared/types";

// Mock the API so the product page resolves without a real fetch.
const shirt: ShirtDetail = {
  id: 1,
  slug: "still-here",
  name: "Still Here Tee",
  base_price_cents: 2499,
  default_image_url: "/shirts/still-here/white.png",
  hero_phrase: "Still Here, Still Clean",
  category: null,
  accent_image_url: null,
  cleantime_mode: "none",
  colors: [
    {
      id: 1,
      name: "White",
      hex: "#FFFFFF",
      image_url: "/shirts/still-here/white.png",
    },
  ],
};

vi.mock("../../src/client/lib/api", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/client/lib/api")>();
  return { ...actual, getShirt: vi.fn(() => Promise.resolve(shirt)) };
});

import { Product } from "../../src/client/pages/Product";

function renderProduct() {
  return render(
    <MemoryRouter initialEntries={["/product/still-here"]}>
      <Routes>
        <Route path="/product/:slug" element={<Product />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Product", () => {
  it("renders a back link to the shop", async () => {
    renderProduct();
    const back = await screen.findByRole("link", { name: /back to shop/i });
    expect(back).toHaveAttribute("href", "/shop");
  });
});
