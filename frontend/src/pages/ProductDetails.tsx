import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, BellRing } from "lucide-react";
import ProductTabs from "../components/ProductTabs";
import ProductImage from "../components/ProductImage";
import { useApi } from "../hooks";
import { api } from "../api";
import { useAuth } from "../context/Auth";
import { Product, WishItem } from "../types";
import { inr } from "../lib/format";

export default function ProductDetails() {
  const { id = "" } = useParams();
  const { data: p, error, loading } = useApi<Product>(`/products/${id}`);
  const { user } = useAuth();
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  if (loading) return <p>Loading…</p>;
  if (error || !p || !p.best) return <p className="text-red-600">{error || "Product not found"}</p>;
  const save = async (target: number, text: string) => {
    if (!user) return nav("/login");
    try { await api<WishItem[]>("/wishlist", { method: "POST", body: JSON.stringify({ productId: p._id, targetPrice: target }) }); setMsg(text); }
    catch (e) { setMsg((e as Error).message); }
  };
  return (
    <div>
      <ProductTabs id={id} />
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage p={p} big />
        <div className="space-y-3">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-black">{p.category}</span>
          <h1 className="text-3xl font-extrabold">{p.name}</h1>
          <p className="text-slate-500">Brand: {p.brand} · ★ {p.rating} customer rating</p>
          <p className="text-4xl font-extrabold">{inr(p.best.total)}</p>
          <p className="text-sm text-slate-500">Current lowest total on {p.best.platform}. Available on {p.offers.filter((o) => o.inStock).map((o) => o.platform).join(", ")}.</p>
          <ul className="list-disc pl-5">{p.specs.map((s) => <li key={s}>{s}</li>)}</ul>
          <div className="card text-sm"><b>Comparison summary:</b> {p.offers.map((o) => `${o.platform} ${o.inStock ? inr(o.total) : "out of stock"}`).join(" · ")}</div>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={() => save(0, "Added to your wishlist")}><Heart size={16} /> Add to wishlist</button>
            <button className="btn-outline" onClick={() => save(Math.round((p.best!.total * 0.95) / 100) * 100, "Tracking: we will alert you below 5% off today’s price")}><BellRing size={16} /> Track price</button>
          </div>
          {msg && <p className="text-sm font-semibold text-green-700">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
