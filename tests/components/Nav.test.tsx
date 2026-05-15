import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Nav } from "../../src/client/components/Nav";

function renderNav() {
  return render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
  );
}

describe("Nav", () => {
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
