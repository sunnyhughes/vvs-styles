import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { Landing } from "./pages/Landing";
import { Shop } from "./pages/Shop";

/** Shared chrome wrapped around every page. */
function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/** Placeholder for routes built in later phases (cart, product, about, FAQ). */
function ComingSoon() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl text-emerald-800">Coming soon</h1>
      <p className="mt-2 font-sans text-base text-stone-700">
        This part of the shop isn&rsquo;t ready yet. Check back soon.
      </p>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
