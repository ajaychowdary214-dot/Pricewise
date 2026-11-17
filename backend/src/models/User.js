import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  wishlist: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      targetPrice: { type: Number, default: 0 },
      _id: false,
    },
  ],
});
export default mongoose.model("User", schema);
