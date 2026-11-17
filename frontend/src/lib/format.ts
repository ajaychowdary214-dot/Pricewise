export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

const SEARCH: Record<string, string> = {
  Amazon: "https://www.amazon.in/s?k=",
  Flipkart: "https://www.flipkart.com/search?q=",
  Croma: "https://www.croma.com/searchB?q=",
  "Reliance Digital": "https://www.reliancedigital.in/search?q=",
  Myntra: "https://www.myntra.com/",
  AJIO: "https://www.ajio.com/search/?text=",
};
// Sends the user to the original shopping platform (no payments on PriceWise).
// With real product feeds, replace this with the exact listing URL stored on each offer.
export function dealUrl(platform: string, name: string) {
  if (platform === "Myntra") return SEARCH.Myntra + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (SEARCH[platform] ?? "https://www.google.com/search?q=") + encodeURIComponent(name);
}
export const PLATFORM_SITES: Record<string, string> = {
  Amazon: "https://www.amazon.in", Flipkart: "https://www.flipkart.com", Croma: "https://www.croma.com",
  "Reliance Digital": "https://www.reliancedigital.in", Myntra: "https://www.myntra.com", AJIO: "https://www.ajio.com",
};
export const CATEGORIES = [
  ["Mobiles", "📱"], ["Laptops", "💻"], ["Electronics", "🎧"], ["Fashion", "👕"],
  ["Watches", "⌚"], ["Shoes", "👟"], ["Home Appliances", "❄️"], ["Accessories", "🎒"],
];
