import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { promo } from "../../src/client/content/promo";
import type { Shirt } from "../../src/shared/types";

// Mock the API so the shop renders without a real fetch. The promo note is
// static header copy, so an empty catalog is enough to assert it.
vi.mock("../../src/client/lib/api", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../src/client/lib/api")>();
  return { ...actual, getShirts: vi.fn(() => Promise.resolve([] as Shirt[])) };
});

import { Shop } from "../../src/client/pages/Shop";

describe("Shop", () => {
  it("shows the introductory launch-pricing note", () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>,
    );
    expect(screen.getByText(promo.shopNote, { exact: false })).toBeInTheDocument();
  });
});
