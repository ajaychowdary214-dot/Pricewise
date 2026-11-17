import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { wrap, httpError } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);

const shape = (user) =>
  user.wishlist
    .filter((w) => w.product)
    .map((w) => ({ product: w.product, targetPrice: w.targetPrice, reached: w.targetPrice > 0 && w.product.lowestTotal <= w.targetPrice }));

const load = (id) => User.findById(id).populate("wishlist.product");

router.get("/", wrap(async (req, res) => res.json(shape(await load(req.userId)))));

// Add or update: { productId, targetPrice }
router.post("/", wrap(async (req, res) => {
  const { productId, targetPrice = 0 } = req.body;
  const user = await User.findById(req.userId);
  const item = user.wishlist.find((w) => String(w.product) === productId);
  if (item) item.targetPrice = Number(targetPrice);
  else user.wishlist.push({ product: productId, targetPrice: Number(targetPrice) });
  await user.save();
  res.json(shape(await load(req.userId)));
}));

router.delete("/:productId", wrap(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw httpError(401, "Please login again");
  user.wishlist = user.wishlist.filter((w) => String(w.product) !== req.params.productId);
  await user.save();
  res.json(shape(await load(req.userId)));
}));

export default router;
