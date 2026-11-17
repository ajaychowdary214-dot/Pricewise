import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "../api";
import { Product } from "../types";

export default function SearchBar({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  const [sug, setSug] = useState<Product[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    if (!q.trim()) return setSug([]);
    const t = setTimeout(() => api<{ items: Product[] }>(`/products?q=${encodeURIComponent(q)}&limit=5`).then((r) => setSug(r.items)).catch(() => setSug([])), 200);
    return () => clearTimeout(t);
  }, [q]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const recent = [q, ...JSON.parse(localStorage.getItem("pw-recent") || "[]").filter((x: string) => x !== q)].slice(0, 4);
    localStorage.setItem("pw-recent", JSON.stringify(recent));
    setSug([]);
    nav(`/search?q=${encodeURIComponent(q)}`);
  };
  return (
    <div className="relative mx-auto max-w-2xl">
      <form onSubmit={submit} className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <input className="min-w-0 flex-1 bg-transparent px-3 text-base outline-none" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “iPhone 17”, “Nike”, “laptop”" aria-label="Search products" />
        <button className="btn"><Search size={16} /> Search Products</button>
      </form>
      {sug.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border bg-white text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {sug.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} onClick={() => setSug([])} className="block px-4 py-2.5 hover:bg-brand-light dark:hover:bg-slate-800">{p.emoji} {p.name}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
