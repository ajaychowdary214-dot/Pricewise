import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/Auth";

export default function AuthPage() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "up" && f.name.trim().length < 2) return setErr("Enter your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return setErr("Enter a valid email address.");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
    try { mode === "in" ? await login(f.email, f.password) : await register(f.name, f.email, f.password); nav("/wishlist"); }
    catch (x) { setErr((x as Error).message); }
  };
  return (
    <form onSubmit={submit} noValidate className="card mx-auto mt-8 max-w-md space-y-3">
      <div className="flex gap-2">{(["in", "up"] as const).map((m) => <button type="button" key={m} onClick={() => { setMode(m); setErr(""); }} className={`flex-1 rounded-lg py-2 font-semibold ${mode === m ? "bg-brand text-white" : "bg-brand-light dark:bg-slate-800"}`}>{m === "in" ? "Login" : "Sign up"}</button>)}</div>
      {mode === "up" && <input className="input" placeholder="Name" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
      <input className="input" type="email" placeholder="Email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <div className="flex gap-2"><input className="input" type={show ? "text" : "password"} placeholder="Password (6+ characters)" autoComplete={mode === "in" ? "current-password" : "new-password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /><button type="button" className="btn-outline" aria-label="Toggle password" onClick={() => setShow(!show)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn w-full">{mode === "in" ? "Login" : "Create account"}</button>
    </form>
  );
}
