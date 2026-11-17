import test from "node:test";
import assert from "node:assert/strict";
import { bestOffer, historyStats, withTotals } from "../src/utils/pricing.js";
import { analyze } from "../src/services/aiService.js";

const offer = (platform, price, delivery, discountPct = 10, inStock = true) => ({ platform, price, delivery, discountPct, seller: "x", inStock });
const phone = {
  offers: [offer("Amazon", 42990, 0, 12), offer("Flipkart", 41999, 799, 15), offer("Croma", 43490, 0, 8)],
};

test("total price = product price + delivery", () => {
  const totals = withTotals(phone).map((o) => o.total);
  assert.deepEqual(totals, [42990, 42798, 43490]);
});

test("lowest TOTAL wins, not lowest product price (Flipkart example)", () => {
  assert.equal(bestOffer(phone).platform, "Flipkart");
  assert.equal(bestOffer(phone).total, 42798);
});

test("out-of-stock offers are never the best deal", () => {
  const p = { offers: [offer("Amazon", 1000, 0, 10, false), offer("Croma", 1500, 0)] };
  assert.equal(bestOffer(p).platform, "Croma");
});

test("historyStats reports high, low, average and position vs average", () => {
  const s = historyStats([100, 120, 80, 100]);
  assert.equal(s.current, 100);
  assert.equal(s.high, 120);
  assert.equal(s.low, 80);
  assert.equal(s.average, 100);
  assert.equal(s.belowAveragePct, 0);
});

test("fake discount detector flags a claimed discount far above the real saving", () => {
  const product = { offers: [offer("Amazon", 45000, 0, 40), offer("Flipkart", 49000, 0, 4)] };
  const prices = [...Array(89).fill(50000), 45000];
  const { fakeDiscounts } = analyze(product, prices);
  assert.equal(fakeDiscounts.find((f) => f.platform === "Amazon").suspicious, true);
  assert.equal(fakeDiscounts.find((f) => f.platform === "Flipkart").suspicious, false);
});

test("prediction says Buy now near the 90-day low", () => {
  const product = { offers: [offer("Amazon", 45000, 0)] };
  const { prediction } = analyze(product, [...Array(89).fill(50000), 45000]);
  assert.equal(prediction.verdict, "Buy now");
  assert.equal(prediction.isEstimate, true);
});

test("prediction says waiting may help when price is above average", () => {
  const product = { offers: [offer("Amazon", 50000, 0)] };
  const { prediction } = analyze(product, [...Array(89).fill(40000), 50000]);
  assert.equal(prediction.verdict, "Waiting may help");
});

test("recommendation follows the user's priority", () => {
  const product = { offers: [offer("Amazon", 39000, 500), offer("Croma", 40000, 0)] };
  const prices = Array(90).fill(42000);
  assert.equal(analyze(product, prices, "price").recommendation.offer.platform, "Amazon");
  assert.equal(analyze(product, prices, "free").recommendation.offer.platform, "Croma");
});
