import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Footer } from "../../src/client/components/Footer";
import { socialLinks } from "../../src/client/content/social";

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );
}

describe("Footer", () => {
  it("names the Esoh Creations umbrella entity", () => {
    renderFooter();
    expect(screen.getByText(/Esoh Creations LLC/)).toBeInTheDocument();
  });

  it.each(socialLinks)("links to $label", ({ label, href }) => {
    renderFooter();
    const link = screen.getByRole("link", { name: label });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_blank");
    // Prevents the opened tab from reaching back via window.opener.
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("gives every social icon an accessible name and hides the glyph", () => {
    const { container } = renderFooter();
    const nav = screen.getByRole("navigation", { name: /social media/i });
    expect(
      screen.getAllByRole("link", { name: /vv-styles on/i }),
    ).toHaveLength(socialLinks.length);
    // Icons are decorative; the <a> carries the name via aria-label.
    for (const svg of Array.from(nav.querySelectorAll("svg"))) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(container.querySelectorAll("svg path")).toHaveLength(
      socialLinks.length,
    );
  });
});
