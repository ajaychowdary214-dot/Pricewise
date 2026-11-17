import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { useApi } from "../hooks";
import { Product } from "../types";
import { inr } from "../lib/format";

export default function Search() {
  const [sp, setSp] = useSearchParams();
  const get = (k: string, d = "") => sp.get(k) ?? d;
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n); };
  const meta = useApi<{ categories: string[]; brands: string[] }>("/products/meta");
  const qs = new URLSearchParams({ q: get("q"), category: get("category"), brand: get("brand"), maxPrice: get("maxPrice"), sort: get("sort", "price") });
  [...qs.keys()].forEach((k) => !qs.get(k) && qs.delete(k));
  const res = useApi<{ total: number; items: Product[] }>(`/products?${qs}`);
  const maxPrice = Number(get("maxPrice", "200000"));
  return (
    <div className="space-y-5">
      <SearchBar initial={get("q")} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">Category<select className="input" value={get("category")} onChange={(e) => set("category", e.target.value)}><option value="">All</option>{meta.data?.categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm">Brand<select className="input" value={get("brand")} onChange={(e) => set("brand", e.target.value)}><option value="">All</option>{meta.data?.brands.map((b) => <option key={b}>{b}</option>)}</select></label>
        <label className="text-sm">Max price: {inr(maxPrice)}<input className="w-full" type="range" min={1000} max={200000} step={1000} value={maxPrice} onChange={(e) => set("maxPrice", e.target.value)} /></label>
        <label className="text-sm">Sort by<select className="input" value={get("sort", "price")} onChange={(e) => set("sort", e.target.value)}><option value="price">Lowest price</option><option value="discount">Highest discount</option><option value="popularity">Popularity</option></select></label>
      </div>
      {res.loading && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-60 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />)}</div>}
      {res.error && <p className="card text-red-600">Something went wrong: {res.error}</p>}
      {!res.loading && res.data && (res.data.items.length ? (
        <><p className="text-sm text-slate-500">{res.data.total} products</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{res.data.items.map((p) => <ProductCard key={p._id} p={p} />)}</div></>
      ) : (
        <div className="card text-center"><h3 className="font-bold">No products found</h3><p className="text-slate-500">Try a different name or clear the filters.</p><button className="btn mt-3" onClick={() => setSp({})}>Reset filters</button></div>
      ))}
    </div>
  );
}
