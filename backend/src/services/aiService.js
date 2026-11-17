// Transparent rule-based "AI". Everything returned is an ESTIMATE based on stored history.
// To use a real AI/LLM API later, keep the analyze() signature and replace the body
// (or call the API and merge its text into the `explanation` fields).
import { average, bestOffer, withTotals } from "../utils/pricing.js";

export function analyze(product, prices, priority = "price") {
  const avg = average(prices);
  const current = prices[prices.length - 1];
  const low = Math.min(...prices);
  const live = withTotals(product).filter((o) => o.inStock);

  const best = bestOffer(product);
  const smartDeal = {
    offer: best,
    explanation: `${best.platform} has the lowest total (price plus delivery) among in-stock offers.`,
  };

  const fakeDiscounts = live.map((o) => {
    const real = Math.round((1 - o.price / avg) * 100);
    return {
      platform: o.platform,
      claimedPct: o.discountPct,
      realPct: real,
      suspicious: o.discountPct - real > 8,
      explanation: "Claimed discount is measured against MRP. Real saving is measured against the 90-day average price.",
    };
  });

  const last7 = average(prices.slice(-7));
  const prev = average(prices.slice(-30, -7));
  const trend = ((last7 - prev) / prev) * 100;
  let verdict = "Neutral";
  let why = "The price is near its average with no clear trend.";
  if (current <= low * 1.03) { verdict = "Buy now"; why = "The price is within 3% of its 90-day low."; }
  else if (trend < -1) { verdict = "Waiting may help"; why = "The price has been falling over the past week."; }
  else if (current > avg) { verdict = "Waiting may help"; why = "The price is above its 90-day average."; }
  const prediction = { verdict, explanation: why, isEstimate: true };

  const pick =
    priority === "free"
      ? [...live].sort((a, b) => (a.delivery > 0) - (b.delivery > 0) || a.total - b.total)[0]
      : priority === "real"
      ? [...live].sort((a, b) => a.price - b.price)[0]
      : best;
  const recommendation = {
    priority,
    offer: pick,
    explanation:
      priority === "free"
        ? "Prefers free delivery, then the lowest total."
        : priority === "real"
        ? "Picks the offer with the lowest actual product price against its history."
        : "Picks the lowest total price including delivery.",
  };

  return { smartDeal, fakeDiscounts, prediction, recommendation, disclaimer: "Estimates from stored price history, not verified by retailers." };
}
