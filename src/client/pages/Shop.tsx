import { useEffect, useState } from "react";
import { ShirtCard } from "../components/ShirtCard";
import { getShirts } from "../lib/api";
import type { Shirt } from "../../shared/types";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; shirts: Shirt[] };

/** The `/shop` product catalog page. */
export function Shop() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getShirts()
      .then((shirts) => {
        if (!cancelled) setState({ status: "ready", shirts });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-emerald-800">
        Shop the collection
      </h1>
      <p className="mt-2 font-sans text-base text-stone-700">
        Milestone tees in your program&rsquo;s language.
      </p>

      {state.status === "loading" && (
        <p className="mt-8 font-sans text-base text-stone-500">
          Loading shirts&hellip;
        </p>
      )}

      {state.status === "error" && (
        <p
          role="alert"
          className="mt-8 font-sans text-base text-red-700"
        >
          Something went wrong loading the shirts. Please refresh to try again.
        </p>
      )}

      {state.status === "ready" && (
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {state.shirts.map((shirt) => (
            <li key={shirt.id}>
              <ShirtCard shirt={shirt} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
