# PriceWise AI

**One Product. Multiple Platforms. Best Price.**

A price comparison platform for Indian shopping sites (Amazon, Flipkart, Croma, Reliance Digital, Myntra, AJIO).
College field project. All prices, discounts and price history are **demonstration data**; no live retailer data is used.

## Tech stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts
- Backend: Node.js, Express, JWT auth (bcrypt)
- Database: MongoDB (Mongoose)
- "AI": transparent rule-based service in `backend/src/services/aiService.js`, ready to be swapped for an AI API

## Run it
Requirements: Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Backend
cd backend
cp .env.example .env        # edit MONGODB_URI / JWT_SECRET if needed
npm install
npm run seed                # loads 73 sample products + 90 days of demo price history
npm run dev                 # API on http://localhost:5000
npm test                    # unit tests for pricing and AI logic (no database needed)

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                 # app on http://localhost:5173 (proxies /api to port 5000)
```

## Project structure
```
backend/
  data/products.json          sample product catalogue (platform-wise prices, delivery, discounts)
  src/models/                 Product, PriceHistory, User (with embedded wishlist)
  src/routes/                 products, auth, wishlist
  src/utils/pricing.js        total price = price + delivery, best offer, history statistics
  src/services/aiService.js   smart deal, fake discount detector, price prediction, recommendation
  src/seed.js                 database seeding
frontend/src/
  pages/                      Home, Search, Versus (2-3 products side by side), Compare, ProductDetails, PriceHistory, AIRecommendations, AuthPage, Wishlist
  components/                 Navbar, SearchBar, ProductCard, ProductImage, ProductTabs
  context/Auth.tsx            login state
  lib/format.ts               ₹ formatting and links to the original shopping platforms
```

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products?q=&category=&brand=&maxPrice=&sort=price\|discount\|popularity` | search, filter, sort |
| GET | `/api/products/meta` `/trending` `/deals` | filters data, trending, best deals |
| GET | `/api/products/:id` | product with per-platform offers and totals |
| GET | `/api/products/:id/history` | 90-day history and statistics |
| GET | `/api/products/:id/analysis?priority=price\|free\|real` | AI analysis |
| POST | `/api/auth/register` `/login` · GET `/me` | authentication |
| GET/POST/DELETE | `/api/wishlist` | wishlist with target price and alert flag |

## How the comparison works
`Total Price = Product Price + Delivery Charges`. The best deal is the lowest total among **in-stock** offers
(computed in `Product.lowestTotal` and `pricing.js`). Example: Flipkart ₹41,999 + ₹799 delivery = ₹42,798 beats Amazon ₹42,990.

## Going from demo to real data (for your report)
1. Register for permitted sources: retailer affiliate/partner product APIs or authorized price feeds. Do not scrape sites that forbid it.
2. Write a small scheduled job (for example `node-cron`) that fetches offers and updates `Product.offers`.
3. Append one `PriceHistory` row per product per day, so history becomes real.
4. Store the real listing URL on each offer and use it in `dealUrl()` instead of a search link.
5. Set `Product.image` to image URLs from those APIs (or your own photos).
6. Add a notification job that checks wishlist targets and sends email or push alerts.

## Known prototype limits
- Prices and history are sample data. Links open each platform's search page, not the exact listing.
- Price drop alerts are shown inside the website only (no email or push yet).
- Tests cover the pricing and AI logic only (`backend/test`). There are no API or UI tests yet.
