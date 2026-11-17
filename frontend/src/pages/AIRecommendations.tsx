import { useState } from "react";
import { useParams } from "react-router-dom";
import ProductTabs from "../components/ProductTabs";
import { useApi } from "../hooks";
import { Analysis, Product } from "../types";
import { dealUrl, inr } from "../lib/format";

export default function AIRecommendations() {
  const { id = "" } = useParams();
  const [priority, setPriority] = useState("price");
  const p = useApi<Product>(`/products/${id}`);
  const a = useApi<Analysis>(`/products/${id}/analysis?priority=${priority}`);
  if (!a.data && a.loading) return <p>Analysing…</p>;
  if (a.error || !a.data || !p.data) return <p className="text-red-600">{a.error || "Not found"}</p>;
  const d = a.data;
  const Link = ({ o }: { o: Analysis["smartDeal"]["offer"] }) => <a className="btn mt-2" href={dealUrl(o.platform, p.data!.name)} target="_blank" rel="noopener noreferrer">View Deal on {o.platform}</a>;
  return (
    <div>
      <ProductTabs id={id} />
      <h1 className="text-3xl font-extrabold">AI recommendations</h1>
      <p className="mb-4 text-sm text-slate-500">{d.disclaimer} Rule-based logic, ready to be swapped for an AI API.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><h3 className="font-bold">1. Smart deal finder</h3><p>Best deal: <b>{d.smartDeal.offer.platform}</b> at <b>{inr(d.smartDeal.offer.total)}</b></p><p className="text-sm text-slate-500">{d.smartDeal.explanation}</p><Link o={d.smartDeal.offer} /></div>
        <div className="card"><h3 className="font-bold">2. Fake discount detector</h3>
          {d.fakeDiscounts.map((f) => <p key={f.platform}>{f.platform}: claims {f.claimedPct}%, real {f.realPct}% vs 90-day average <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${f.suspicious ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{f.suspicious ? "Suspicious" : "Looks fair"}</span></p>)}
          <p className="text-sm text-slate-500">{d.fakeDiscounts[0]?.explanation}</p></div>
        <div className="card"><h3 className="font-bold">3. Price prediction <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-black">Estimate</span></h3><p><b>{d.prediction.verdict}.</b> {d.prediction.explanation}</p><p className="text-sm text-slate-500">Based on a trend and range rule over stored history. Not a guarantee.</p></div>
        <div className="card"><h3 className="font-bold">4. Your recommendation</h3>
          <select className="input my-2" value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="My priority"><option value="price">Lowest total price</option><option value="free">Free delivery</option><option value="real">Most real savings</option></select>
          <p>Buy from <b>{d.recommendation.offer.platform}</b> ({inr(d.recommendation.offer.total)}). <span className="text-slate-500">{d.recommendation.explanation}</span></p><Link o={d.recommendation.offer} /></div>
      </div>
    </div>
  );
}
