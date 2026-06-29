import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { Nav } from "../../src/client/components/Nav";
import { addToCart, clearCart } from "../../src/client/lib/cart";

function renderNav() {
  return render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
  );
}

describe("Nav", () => {
  beforeEach(() => {
    clearCart();
  });

  it("shows no cart count badge when the cart is empty", () => {
    renderNav();
    const cartLink = screen.getByRole("link", { name: /^cart$/i });
    expect(cartLink).toHaveTextContent("");
  });

  it("shows the item count and announces it once items are added", () => {
    addToCart({
      slug: "still-here",
      name: "Still Here Tee",
      unitPriceCents: 2499,
      imageUrl: "/shirts/still-here/white.png",
      color: "White",
      colorHex: "#FFFFFF",
      size: "M",
      cleantimeMode: "none",
      cleantimeValue: 0,
      qty: 2,
    });
    renderNav();
    const cartLink = screen.getByRole("link", { name: /cart, 2 items/i });
    expect(cartLink).toHaveTextContent("2");
  });
  it("opens the mobile drawer when the hamburger is clicked", async () => {
    const user = userEvent.setup();
    renderNav();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const drawerNav = within(await screen.findByRole("dialog")).getByRole(
      "navigation",
      { name: /mobile/i },
    );
    expect(
      within(drawerNav).getByRole("link", { name: "Shop" }),
    ).toBeInTheDocument();
  });

  it("opens the drawer from the keyboard (Enter on the focused hamburger)", async () => {
    const user = userEvent.setup();
    renderNav();

    const hamburger = screen.getByRole("button", { name: /open menu/i });
    hamburger.focus();
    expect(hamburger).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("closes the drawer when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
