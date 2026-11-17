// npm run seed : loads data/products.json and generates 90 days of demo price history.
import "dotenv/config";
import fs from "node:fs";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import PriceHistory from "./models/PriceHistory.js";

await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pricewise");
const data = JSON.parse(fs.readFileSync(new URL("../data/products.json", import.meta.url)));
await Product.deleteMany({});
await PriceHistory.deleteMany({});
const products = await Product.insertMany(data);

let seed = 7919;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const rows = [];
for (const p of products) {
  const current = p.lowestTotal;
  const base = current * 1.1;
  for (let k = 0; k < 90; k++) {
    let v = base * (1 + (rand() - 0.5) * 0.06);
    if (k > 20 && k < 27) v = base * 0.93; // sale
    if (k > 55 && k < 60) v = base * 0.96; // sale
    if (k >= 76) v = current + ((v - current) * (89 - k)) / 13; // settles at the current price
    const date = new Date(Date.now() - (89 - k) * 86400000);
    rows.push({ product: p._id, date, price: Math.round(v / 10) * 10 });
  }
}
await PriceHistory.insertMany(rows);
console.log(`Seeded ${products.length} products and ${rows.length} demo price points`);
await mongoose.disconnect();
