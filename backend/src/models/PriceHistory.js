import mongoose from "mongoose";
const schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", index: true },
  date: Date,
  price: Number, // lowest delivered price on that day
});
export default mongoose.model("PriceHistory", schema);
