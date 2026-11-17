import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "../api";
import { User } from "../types";

interface AuthValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
const Ctx = createContext<AuthValue>(null as unknown as AuthValue);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (localStorage.getItem("pw-token")) api<User>("/auth/me").then(setUser).catch(() => localStorage.removeItem("pw-token"));
  }, []);
  const done = (r: { token: string; user: User }) => { localStorage.setItem("pw-token", r.token); setUser(r.user); };
  const login = async (email: string, password: string) =>
    done(await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }));
  const register = async (name: string, email: string, password: string) =>
    done(await api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }));
  const logout = () => { localStorage.removeItem("pw-token"); setUser(null); };
  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
}
