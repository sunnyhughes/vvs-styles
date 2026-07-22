import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { About } from "./pages/About";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { FAQ } from "./pages/FAQ";
import { Landing } from "./pages/Landing";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { Product } from "./pages/Product";
import { Shop } from "./pages/Shop";

/** Shared chrome wrapped around every page. */
function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

/** 404 fallback for any unmatched route. */
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
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order/confirmation/:id"
            element={<OrderConfirmation />}
          />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
