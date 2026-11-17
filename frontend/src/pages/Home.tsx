import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { useApi } from "../hooks";
import { Product } from "../types";
import { CATEGORIES, PLATFORM_SITES } from "../lib/format";

export default function Home() {
  const trending = useApi<Product[]>("/products/trending");
  const deals = useApi<Product[]>("/products/deals");
  const recent: string[] = JSON.parse(localStorage.getItem("pw-recent") || "[]");
  const steps = [
    ["Search once", "Type a product name and we look across six platforms."],
    ["Compare final prices", "Product price plus delivery, so the total is honest."],
    ["Check the history", "See whether the discount is genuine before you buy."],
    ["Buy on the original site", "We send you to the retailer. No payments here."],
  ];
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-b from-brand-light to-transparent px-4 py-14 text-center dark:from-slate-900">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">Find the Best Price. Shop Smarter.</h1>
        <p className="mx-auto my-4 max-w-xl text-lg text-slate-500">Compare products across India’s leading shopping platforms and discover the best deals in seconds.</p>
        <SearchBar />
        {recent.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">Recent: {recent.map((r) => <Link key={r} to={`/search?q=${encodeURIComponent(r)}`} className="mx-1 rounded-full border px-3 py-1 hover:border-brand">{r}</Link>)}</p>
        )}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">Popular categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map(([c, e]) => (
            <Link key={c} to={`/search?category=${encodeURIComponent(c)}`} className="card text-center font-semibold transition hover:-translate-y-1 hover:border-brand"><span className="block text-4xl">{e}</span>{c}</Link>
          ))}
        </div>
      </section>
      {[["Trending products", trending], ["Today’s best deals", deals]].map(([title, res]) => (
        <section key={title as string}>
          <h2 className="mb-4 text-2xl font-extrabold">{title as string}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(res as typeof trending).data?.map((p) => <ProductCard key={p._id} p={p} />)}</div>
          {(res as typeof trending).error && <p className="text-red-600">Could not load products: {(res as typeof trending).error}</p>}
        </section>
      ))}
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">Featured shopping platforms</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(PLATFORM_SITES).map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="card font-semibold hover:border-brand hover:text-brand">{n} ↗</a>)}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">How PriceWise works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => <div key={t} className="card"><b className="mb-2 grid h-9 w-9 place-items-center rounded-full bg-brand text-white">{i + 1}</b><h3 className="font-bold">{t}</h3><p className="text-sm text-slate-500">{d}</p></div>)}
        </div>
      </section>
    </div>
  );
}
