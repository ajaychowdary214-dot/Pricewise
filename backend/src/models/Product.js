import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  { platform: String, price: Number, delivery: Number, discountPct: Number, seller: String, inStock: Boolean },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: String,
  emoji: String,
  image: String, // set a real image URL here (own photos or a retailer API) and the frontend will show it
  mrp: Number,
  rating: Number,
  popularity: Number,
  specs: [String],
  offers: [offerSchema], // one entry per platform. Replace with live API/feed data later.
  lowestTotal: Number, // derived: cheapest in-stock (price + delivery)
  bestPlatform: String,
  bestDiscount: Number,
});

// Total Price = Product Price + Delivery Charges. Always compare totals, never the product price alone.
productSchema.pre("validate", function (next) {
  const live = this.offers
    .filter((o) => o.inStock)
    .map((o) => ({ platform: o.platform, discountPct: o.discountPct, total: o.price + o.delivery }))
    .sort((a, b) => a.total - b.total);
  if (live[0]) {
    this.lowestTotal = live[0].total;
    this.bestPlatform = live[0].platform;
    this.bestDiscount = live[0].discountPct;
  }
  next();
});

export default mongoose.model("Product", productSchema);
