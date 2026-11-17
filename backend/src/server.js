import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import products from "./routes/products.js";
import auth from "./routes/auth.js";
import wishlist from "./routes/wishlist.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/products", products);
app.use("/api/auth", auth);
app.use("/api/wishlist", wishlist);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pricewise");
app.listen(process.env.PORT || 5000, () => console.log("PriceWise API running"));
