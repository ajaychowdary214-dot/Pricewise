import { useParams } from "react-router-dom";
import ProductTabs from "../components/ProductTabs";
import { useApi } from "../hooks";
import { Product } from "../types";
import { dealUrl, inr } from "../lib/format";

export default function Compare() {
  const { id = "" } = useParams();
  const { data: p, error, loading } = useApi<Product>(`/products/${id}`);
  if (loading) return <p>Loading…</p>;
  if (error || !p) return <p className="text-red-600">{error || "Not found"}</p>;
  const live = p.offers.filter((o) => o.inStock).sort((a, b) => a.total - b.total);
  const best = live[0];
  const worst = live[live.length - 1];
  const rows = [...p.offers].sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.total - b.total);
  return (
    <div>
      <ProductTabs id={id} />
      <h1 className="text-3xl font-extrabold">{p.name}</h1>
      <p className="mb-4 text-slate-500">Total Price = Product Price + Delivery Charges. Demonstration prices.</p>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-slate-500"><tr>{["Platform", "Price", "Delivery", "Total", "Discount", "Seller", "Availability", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.platform} className={`border-t border-slate-200 dark:border-slate-800 ${o === best ? "bg-green-50 dark:bg-green-950" : ""}`}>
                <td className="p-3 font-bold">{o.platform} {o === best && <span className="ml-1 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">BEST DEAL</span>}</td>
                <td className="p-3">{inr(o.price)}</td>
                <td className="p-3">{o.delivery ? inr(o.delivery) : "Free"}</td>
                <td className="p-3 font-extrabold">{inr(o.total)}</td>
                <td className="p-3">{o.discountPct}%</td>
                <td className="p-3">{o.seller}</td>
                <td className="p-3">{o.inStock ? "In stock" : <span className="text-red-600">Out of stock</span>}</td>
                <td className="p-3">{o.inStock && <a className="btn" href={dealUrl(o.platform, p.name)} target="_blank" rel="noopener noreferrer">View Deal</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card mt-4"><b>Estimated savings:</b> choosing {best.platform} saves you {inr(worst.total - best.total)} compared with the most expensive in-stock option ({worst.platform}).</div>
    </div>
  );
}
