import { useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ProductTabs from "../components/ProductTabs";
import { useApi } from "../hooks";
import { HistoryRes, Product } from "../types";
import { inr } from "../lib/format";

export default function PriceHistory() {
  const { id = "" } = useParams();
  const p = useApi<Product>(`/products/${id}`);
  const h = useApi<HistoryRes>(`/products/${id}/history`);
  if (h.loading) return <p>Loading…</p>;
  if (h.error || !h.data) return <p className="text-red-600">{h.error}</p>;
  const s = h.data.stats;
  const verdict = s.belowAveragePct >= 5 ? "Genuinely good deal" : s.belowAveragePct >= 0 ? "Average price" : "Priced above average";
  const data = h.data.points.map((x) => ({ day: new Date(x.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), price: x.price }));
  return (
    <div>
      <ProductTabs id={id} />
      <h1 className="text-3xl font-extrabold">{p.data?.name} <span className="ml-2 rounded-full bg-accent px-3 py-1 align-middle text-xs text-black">Demonstration data</span></h1>
      <div className="my-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Current", s.current], ["Highest", s.high], ["Lowest", s.low], ["Average", s.average]].map(([l, v]) => <div key={l as string} className="rounded-xl bg-brand-light p-3 dark:bg-slate-800"><div className="text-sm text-slate-500">{l}</div><b className="text-xl">{inr(v as number)}</b></div>)}
      </div>
      <div className="card h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="day" minTickGap={30} /><YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => "₹" + v / 1000 + "k"} width={60} /><Tooltip formatter={(v: number) => inr(v)} /><Line type="monotone" dataKey="price" stroke="#2563EB" strokeWidth={2.5} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4"><b>{verdict}.</b> The current price is {Math.abs(s.belowAveragePct)}% {s.belowAveragePct >= 0 ? "below" : "above"} the 90-day average and lower than it was on {s.daysHigherPct}% of days.</p>
    </div>
  );
}
