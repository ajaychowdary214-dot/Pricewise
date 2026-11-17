export interface Offer { platform: string; price: number; delivery: number; total: number; discountPct: number; seller: string; inStock: boolean }
export interface Product {
  _id: string; name: string; brand: string; category: string; emoji: string; image?: string;
  mrp: number; rating: number; popularity: number; specs: string[];
  offers: Offer[]; lowestTotal: number; bestPlatform: string; bestDiscount: number; best?: Offer;
}
export interface HistoryRes {
  points: { date: string; price: number }[];
  stats: { current: number; high: number; low: number; average: number; belowAveragePct: number; daysHigherPct: number };
}
export interface Analysis {
  smartDeal: { offer: Offer; explanation: string };
  fakeDiscounts: { platform: string; claimedPct: number; realPct: number; suspicious: boolean; explanation: string }[];
  prediction: { verdict: string; explanation: string; isEstimate: boolean };
  recommendation: { priority: string; offer: Offer; explanation: string };
  disclaimer: string;
}
export interface WishItem { product: Product; targetPrice: number; reached: boolean }
export interface User { id: string; name: string; email: string }
