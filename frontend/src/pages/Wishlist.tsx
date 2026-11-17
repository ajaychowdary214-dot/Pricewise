import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/Auth";
import { WishItem } from "../types";
import { dealUrl, inr } from "../lib/format";

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishItem[]>([]);
  const [targets, setTargets] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const apply = (r: WishItem[]) => { setItems(r); setTargets(Object.fromEntries(r.map((w) => [w.product._id, String(w.targetPrice || "")]))); };
  useEffect(() => { if (user) api<WishItem[]>("/wishlist").then(apply).catch((e: Error) => setErr(e.message)); }, [user]);
  if (!user) return <div className="card"><h2 className="text-xl font-bold">Your wishlist</h2><p className="mb-3">Login to save products and set target prices.</p><Link to="/login" className="btn">Login or sign up</Link></div>;
  const setTarget = (w: WishItem, t: number) => api<WishItem[]>("/wishlist", { method: "POST", body: JSON.stringify({ productId: w.product._id, targetPrice: t }) }).then(apply).catch((e: Error) => setErr(e.message));
  const remove = (w: WishItem) => api<WishItem[]>(`/wishlist/${w.product._id}`, { method: "DELETE" }).then(apply).catch((e: Error) => setErr(e.message));
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Your wishlist</h1>
      {err && <p className="text-red-600">{err}</p>}
      {items.filter((w) => w.reached).map((w) => <div key={w.product._id} className="rounded-xl bg-green-100 p-3 font-semibold text-green-800">🔔 Price drop: {w.product.name} is now {inr(w.product.lowestTotal)}, at or below your target of {inr(w.targetPrice)}.</div>)}
      {!items.length && <div className="card"><p>Your wishlist is empty.</p><Link to="/search" className="btn mt-2">Browse products</Link></div>}
      {items.map((w) => (
        <div key={w.product._id} className="card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><Link to={`/product/${w.product._id}`} className="text-lg font-bold">{w.product.emoji} {w.product.name}</Link>
              <p>Current price <b>{inr(w.product.lowestTotal)}</b> {w.reached && <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Target reached</span>}</p>
              <p className="text-sm text-slate-500">{w.targetPrice ? `Target price ${inr(w.targetPrice)}` : "No target set"}</p></div>
            <div className="flex gap-2"><input className="input w-36" type="number" min={1} placeholder="Target ₹" aria-label="Target price" value={targets[w.product._id] ?? ""} onChange={(e) => setTargets({ ...targets, [w.product._id]: e.target.value })} /><button className="btn" onClick={() => Number(targets[w.product._id]) > 0 ? setTarget(w, Number(targets[w.product._id])) : setErr("Enter a valid target price")}>Save target</button></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-outline" onClick={() => setTarget(w, Math.round((w.product.lowestTotal * 0.95) / 100) * 100)}>Track price</button>
            <a className="btn-outline" href={dealUrl(w.product.bestPlatform, w.product.name)} target="_blank" rel="noopener noreferrer">Buy now on {w.product.bestPlatform}</a>
            <button className="btn-outline" onClick={() => remove(w)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
