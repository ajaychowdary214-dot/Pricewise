// Core comparison logic. Pure functions, easy to unit test.
export const toPlain = (doc) => (doc.toObject ? doc.toObject() : doc);

export const withTotals = (product) =>
  toPlain(product).offers.map((o) => ({ ...o, total: o.price + o.delivery }));

export const bestOffer = (product) =>
  withTotals(product)
    .filter((o) => o.inStock)
    .sort((a, b) => a.total - b.total)[0];

export const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

export function historyStats(prices) {
  const current = prices[prices.length - 1];
  const avg = average(prices);
  return {
    current,
    high: Math.max(...prices),
    low: Math.min(...prices),
    average: Math.round(avg),
    belowAveragePct: Math.round((1 - current / avg) * 100),
    daysHigherPct: Math.round((prices.filter((p) => p > current).length / prices.length) * 100),
  };
}
