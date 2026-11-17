import { Link } from "react-router-dom";
import { Product } from "../types";
import { inr } from "../lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/product/${p._id}`} className="card flex flex-col gap-1.5 transition hover:-translate-y-1 hover:border-brand hover:shadow-lg">
      <ProductImage p={p} />
      <h3 className="mt-1 font-bold leading-tight">{p.name}</h3>
      <p className="text-sm text-slate-500">{p.brand} · {p.category} · ★ {p.rating}</p>
      <p className="text-2xl font-extrabold">{inr(p.lowestTotal)}</p>
      <p className="text-sm text-slate-500">Lowest total on {p.bestPlatform}</p>
      <span className="w-fit rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">{p.bestDiscount}% off</span>
    </Link>
  );
}
