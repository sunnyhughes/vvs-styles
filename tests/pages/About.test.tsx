import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { About } from "../../src/client/pages/About";

function renderAbout() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );
}

describe("About", () => {
  it("renders the founder-story heading", () => {
    renderAbout();
    expect(
      screen.getByRole("heading", { level: 1, name: /very vocal/i }),
    ).toBeInTheDocument();
  });

  it("names the Esoh Creations umbrella entity", () => {
    renderAbout();
    expect(screen.getByText(/Esoh Creations LLC/)).toBeInTheDocument();
  });

  it("links back to the shop", () => {
    renderAbout();
    expect(
      screen.getByRole("link", { name: /shop the collection/i }),
    ).toHaveAttribute("href", "/shop");
  });

  it("renders the founder's note, signed without a name", () => {
    const { container } = renderAbout();
    const quote = container.querySelector("blockquote");
    expect(quote).not.toBeNull();
    expect(quote).toHaveTextContent(/proud of my recovery/i);
    expect(quote).toHaveTextContent(/—\s*Founder, vv-styles/);
  });

  it("ships no unfilled copy placeholders", () => {
    const { container } = renderAbout();
    // Guards the [FOUNDER: ...] bracket that sat here until 2026-07-09.
    expect(container.textContent).not.toMatch(/\[[A-Z]+:/);
  });
});
