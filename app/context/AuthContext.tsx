"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Account } from "@/types/account";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const api = useApi();
  const [token, _setToken] = useState<string | null>(null);

  const setToken = (newToken: string | null) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      _setToken(stored);
      api.get<Account>("/account/validate").catch(() => logout());
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    _setToken(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn: !!token, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
