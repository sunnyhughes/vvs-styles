import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AddToCartButton } from "../../src/client/components/AddToCartButton";
import { CartDrawer } from "../../src/client/components/CartDrawer";
import { clearCart, closeCart, type NewCartItem } from "../../src/client/lib/cart";

const item: NewCartItem = {
  slug: "still-here",
  name: "Still Here Tee",
  unitPriceCents: 2800,
  imageUrl: "/placeholder-shirt.svg",
  color: "White",
  colorHex: "#FFFFFF",
  size: "M",
  cleantimeMode: "years",
  cleantimeValue: 0,
};

function renderDrawer() {
  return render(
    <MemoryRouter>
      <AddToCartButton item={item} />
      <CartDrawer />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  clearCart();
  closeCart();
});

describe("CartDrawer", () => {
  it("opens when an item is added to the cart", async () => {
    const user = userEvent.setup();
    renderDrawer();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Still Here Tee")).toBeInTheDocument();
  });

  it("moves focus into the drawer when it opens (focus trap)", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  });
});
