import { NavLink } from "react-router-dom";
const tabs = [["product", "Details"], ["compare", "Compare prices"], ["history", "Price history"], ["ai", "AI picks"]];
export default function ProductTabs({ id }: { id: string }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {tabs.map(([path, label]) => (
        <NavLink key={path} to={`/${path}/${id}`} className={({ isActive }) => `rounded-full px-4 py-1.5 text-sm font-semibold ${isActive ? "bg-brand text-white" : "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300"}`}>{label}</NavLink>
      ))}
    </div>
  );
}
