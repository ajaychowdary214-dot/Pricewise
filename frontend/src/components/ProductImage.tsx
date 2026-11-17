import { Product } from "../types";
// Shows a real photo when product.image is set, otherwise the emoji placeholder.
export default function ProductImage({ p, big = false }: { p: Product; big?: boolean }) {
  return (
    <div className={`grid place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-light to-slate-100 dark:from-slate-800 dark:to-slate-900 ${big ? "h-64 text-8xl" : "h-32 text-5xl"}`}>
      {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-contain" loading="lazy" /> : <span aria-hidden>{p.emoji}</span>}
    </div>
  );
}
