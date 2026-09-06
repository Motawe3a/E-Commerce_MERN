import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  setAuthToken,
  setUnauthorizedHandler,
  TOKEN_STORAGE_KEY,
} from "@/lib/axios";
import { decodeToken } from "@/lib/jwt";
import { AuthContext } from "./context";

function readStoredToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;
    // Drop tokens that are malformed or already expired.
    return decodeToken(token) ? token : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(readStoredToken);

  const user = useMemo(() => (token ? decodeToken(token) : null), [token]);

  const login = useCallback((next: string) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, next);
    } catch {
      /* ignore persistence failure */
    }
    setAuthToken(next);
    setToken(next);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setAuthToken(null);
    setToken(null);
    queryClient.removeQueries({ queryKey: ["cart"] });
    queryClient.removeQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  // Keep the axios default header in sync with the current token.
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Log the user out when any request comes back 401.
  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Reflect logins/logouts that happen in another tab.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== TOKEN_STORAGE_KEY) return;
      setToken(readStoredToken());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
    [token, user, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
