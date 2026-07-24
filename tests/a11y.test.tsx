import axe from "axe-core";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ShirtSummary } from "../src/shared/types";

/**
 * Automated accessibility guard: renders each key surface and runs axe-core,
 * failing on any WCAG violation. This is the permanent regression net for the
 * manual audit done 2026-07-24.
 *
 * Two rules are disabled on purpose:
 *  - `color-contrast` needs real layout/paint, which jsdom doesn't do; contrast
 *    was verified by hand (all AA-passing) and can't be meaningfully checked here.
 *  - `region` flags content sitting outside a landmark, which is a false positive
 *    when a component/page is rendered in isolation (the app's <main> comes from
 *    the Layout wrapper, which these unit renders don't include).
 */
async function expectNoViolations(container: HTMLElement) {
  const { violations } = await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });

  if (violations.length > 0) {
    const detail = violations
      .map(
        (v) =>
          `[${v.impact ?? "n/a"}] ${v.id}: ${v.help}\n    ` +
          v.nodes.map((n) => n.target.join(" ")).join("\n    "),
      )
      .join("\n");
    throw new Error(`${violations.length} axe violation(s):\n${detail}`);
  }

  expect(violations).toEqual([]);
}

const shirtFixture: ShirtSummary = {
  id: 1,
  slug: "still-here",
  name: "Still Here Tee",
  base_price_cents: 2499,
  default_image_url: "/shirts/still-here/white.png",
  hero_phrase: "Still Here, Still Clean",
  colors: [
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#111111" },
  ],
};

vi.mock("../src/client/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/client/lib/api")>();
  return { ...actual, getShirts: vi.fn(() => Promise.resolve([shirtFixture])) };
});

import { Footer } from "../src/client/components/Footer";
import { Hero } from "../src/client/components/Hero";
import { Nav } from "../src/client/components/Nav";
import { PromoBanner } from "../src/client/components/PromoBanner";
import { ShirtCard } from "../src/client/components/ShirtCard";
import { About } from "../src/client/pages/About";
import { FAQ } from "../src/client/pages/FAQ";
import { Shop } from "../src/client/pages/Shop";

function renderInRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("accessibility (axe)", () => {
  it("PromoBanner has no violations", async () => {
    const { container } = render(<PromoBanner />);
    await expectNoViolations(container);
  });

  it("Nav has no violations", async () => {
    const { container } = renderInRouter(<Nav />);
    await expectNoViolations(container);
  });

  it("Footer has no violations", async () => {
    const { container } = renderInRouter(<Footer />);
    await expectNoViolations(container);
  });

  it("Hero (landing) has no violations", async () => {
    const { container } = renderInRouter(<Hero />);
    await expectNoViolations(container);
  });

  it("About page has no violations", async () => {
    const { container } = renderInRouter(<About />);
    await expectNoViolations(container);
  });

  it("FAQ page has no violations", async () => {
    const { container } = renderInRouter(<FAQ />);
    await expectNoViolations(container);
  });

  it("ShirtCard has no violations", async () => {
    const { container } = renderInRouter(<ShirtCard shirt={shirtFixture} />);
    await expectNoViolations(container);
  });

  it("Shop page has no violations once loaded", async () => {
    const { container } = renderInRouter(<Shop />);
    await screen.findByText(shirtFixture.name);
    await expectNoViolations(container);
  });
});
