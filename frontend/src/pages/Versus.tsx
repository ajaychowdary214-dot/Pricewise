import { useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import { useApi } from "../hooks";
import { Product } from "../types";
import { dealUrl, inr } from "../lib/format";

export default function Versus() {
  const all = useApi<{ items: Product[] }>("/products?limit=200&sort=popularity");
  const [ids, setIds] = useState(["", "", ""]);
  const items = all.data?.items ?? [];
  const picks = ids.map((id, i) => id || (i < 2 ? items[i]?._id ?? "" : ""));
  const chosen = picks.map((id) => items.find((p) => p._id === id)).filter((p): p is Product => !!p);
  const platforms = [...new Set(chosen.flatMap((p) => p.offers.map((o) => o.platform)))];
  const lowest = Math.min(...chosen.map((p) => p.lowestTotal));
  const topRated = Math.max(...chosen.map((p) => p.rating));
  const best = (p: Product) => p.offers.find((o) => o.platform === p.bestPlatform);

  const Row = ({ label, cell }: { label: string; cell: (p: Product) => React.ReactNode }) => (
    <tr className="border-t border-slate-200 dark:border-slate-800">
      <th className="p-3 text-left font-semibold text-slate-500">{label}</th>
      {chosen.map((p) => <td key={p._id} className="p-3 align-top">{cell(p)}</td>)}
    </tr>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Compare products side by side</h1>
      {all.error && <p className="text-red-600">{all.error}</p>}
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((n) => (
          <label key={n} className="text-sm">Product {n + 1}{n > 1 && " (optional)"}
            <select className="input" value={picks[n]} onChange={(e) => setIds(ids.map((v, i) => (i === n ? e.target.value : picks[i])))}>
              {n > 1 && <option value="">None</option>}
              {items.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </label>
        ))}
      </div>
      {chosen.length >= 2 && (
        <div className="card overflow-x-auto">
          <p className="mb-3 text-sm"><b>Cheapest:</b> {chosen.find((p) => p.lowestTotal === lowest)?.name} at {inr(lowest)}. <b>Highest rated:</b> {chosen.find((p) => p.rating === topRated)?.name} (★ {topRated}).</p>
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr><th />{chosen.map((p) => <th key={p._id} className="p-3 text-left"><Link to={`/product/${p._id}`} className="hover:text-brand">{p.name}</Link></th>)}</tr></thead>
            <tbody>
              <Row label="Image" cell={(p) => <ProductImage p={p} />} />
              <Row label="Brand" cell={(p) => p.brand} />
              <Row label="Category" cell={(p) => p.category} />
              <Row label="Rating" cell={(p) => <>★ {p.rating} {p.rating === topRated && <span className="rounded-full bg-green-100 px-2 text-xs font-bold text-green-700">Top rated</span>}</>} />
              <Row label="MRP" cell={(p) => inr(p.mrp)} />
              <Row label="Lowest total" cell={(p) => <><b>{inr(p.lowestTotal)}</b> {p.lowestTotal === lowest && <span className="rounded-full bg-green-100 px-2 text-xs font-bold text-green-700">Lowest</span>}</>} />
              <Row label="Best platform" cell={(p) => p.bestPlatform} />
              <Row label="Discount" cell={(p) => `${p.bestDiscount}%`} />
              <Row label="Delivery" cell={(p) => (best(p)?.delivery ? inr(best(p)!.delivery) : "Free")} />
              {platforms.map((pl) => <Row key={pl} label={pl} cell={(p) => { const o = p.offers.find((x) => x.platform === pl); return o ? (o.inStock ? inr(o.price + o.delivery) : "Out of stock") : "—"; }} />)}
              <Row label="Buy" cell={(p) => <a className="btn" href={dealUrl(p.bestPlatform, p.name)} target="_blank" rel="noopener noreferrer">View Deal</a>} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
