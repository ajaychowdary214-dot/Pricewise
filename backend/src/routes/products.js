import { Router } from "express";
import Product from "../models/Product.js";
import PriceHistory from "../models/PriceHistory.js";
import { wrap, httpError } from "../utils/asyncHandler.js";
import { bestOffer, historyStats, withTotals, toPlain } from "../utils/pricing.js";
import { analyze } from "../services/aiService.js";

const router = Router();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SORTS = { price: { lowestTotal: 1 }, discount: { bestDiscount: -1 }, popularity: { popularity: -1 } };

// GET /api/products?q=&category=&brand=&maxPrice=&sort=price|discount|popularity&limit=
router.get("/", wrap(async (req, res) => {
  const { q, category, brand, maxPrice, sort = "price", limit = 100 } = req.query;
  const filter = {};
  if (q) filter.$and = String(q).split(/\s+/).filter(Boolean).map((w) => ({
    $or: [{ name: new RegExp(esc(w), "i") }, { brand: new RegExp(esc(w), "i") }, { category: new RegExp(esc(w), "i") }],
  }));
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (maxPrice) filter.lowestTotal = { $lte: Number(maxPrice) };
  const items = await Product.find(filter).sort(SORTS[sort] || SORTS.price).limit(Number(limit));
  res.json({ total: items.length, items });
}));

router.get("/meta", wrap(async (_req, res) => {
  res.json({ categories: await Product.distinct("category"), brands: (await Product.distinct("brand")).sort() });
}));
router.get("/trending", wrap(async (_req, res) => res.json(await Product.find().sort({ popularity: -1 }).limit(4))));
router.get("/deals", wrap(async (_req, res) => res.json(await Product.find().sort({ bestDiscount: -1 }).limit(4))));

router.get("/:id", wrap(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json({ ...toPlain(product), offers: withTotals(product), best: bestOffer(product) });
}));

router.get("/:id/history", wrap(async (req, res) => {
  const points = await PriceHistory.find({ product: req.params.id }).sort({ date: 1 });
  if (!points.length) throw httpError(404, "No price history yet");
  res.json({ points: points.map((p) => ({ date: p.date, price: p.price })), stats: historyStats(points.map((p) => p.price)) });
}));

router.get("/:id/analysis", wrap(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const points = await PriceHistory.find({ product: req.params.id }).sort({ date: 1 });
  if (!product || !points.length) throw httpError(404, "Product not found");
  res.json(analyze(product, points.map((p) => p.price), String(req.query.priority || "price")));
}));

export default router;
