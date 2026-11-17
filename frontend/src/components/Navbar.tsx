import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Moon, ShoppingCart, Sun } from "lucide-react";
import { useAuth } from "../context/Auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const toggleTheme = () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("pw-theme", dark ? "dark" : "light");
  };
  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-brand-light text-brand dark:bg-slate-800" : "text-slate-500 hover:text-brand"}`;
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link to="/" className="mr-auto flex items-center gap-2 text-lg font-extrabold">
          <ShoppingCart className="text-brand" size={22} /> PriceWise <span className="text-brand">AI</span>
        </Link>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}><Menu /></button>
        <div className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-16 flex-col gap-1 border-b bg-white p-4 dark:bg-slate-900 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`} onClick={() => setOpen(false)}>
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/search" className={link}>Search</NavLink>
          <NavLink to="/versus" className={link}>Compare</NavLink>
          <NavLink to="/wishlist" className={link}>Wishlist</NavLink>
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="rounded-lg p-2 text-slate-500 hover:text-brand">
            <Sun size={18} className="hidden dark:block" /><Moon size={18} className="dark:hidden" />
          </button>
          {user ? (
            <button className="btn-outline" onClick={() => { logout(); nav("/"); }}>Logout ({user.name.split(" ")[0]})</button>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
