import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Compare from "./pages/Compare";
import ProductDetails from "./pages/ProductDetails";
import PriceHistory from "./pages/PriceHistory";
import AIRecommendations from "./pages/AIRecommendations";
import AuthPage from "./pages/AuthPage";
import Wishlist from "./pages/Wishlist";
import Versus from "./pages/Versus";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/versus" element={<Versus />} />
          <Route path="/compare/:id" element={<Compare />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/history/:id" element={<PriceHistory />} />
          <Route path="/ai/:id" element={<AIRecommendations />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<p className="py-20 text-center">Page not found.</p>} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        PriceWise AI · One Product. Multiple Platforms. Best Price. · contact@pricewise.demo
        <br />Prices shown are demonstration data. Checkout always happens on the original shopping site.
      </footer>
    </>
  );
}
