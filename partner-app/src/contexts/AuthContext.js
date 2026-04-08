import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../api";

const Ctx = createContext(null);

export function PartnerAuthProvider({ children }) {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("partner_token");
    if (token) {
      api.getMe().then(setPartner).catch(() => { localStorage.removeItem("partner_token"); setPartner(null); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const login = async (email, password) => { const r = await api.login(email, password); setPartner(r.partner); return r; };
  const register = async (data) => { const r = await api.register(data); setPartner(r.partner); return r; };
  const logout = () => { api.logout(); setPartner(null); router.push("/"); };

  return <Ctx.Provider value={{ partner, setPartner, loading, login, register, logout }}>{children}</Ctx.Provider>;
}

export function usePartnerAuth() { const c = useContext(Ctx); if (!c) throw new Error("usePartnerAuth must be inside PartnerAuthProvider"); return c; }
