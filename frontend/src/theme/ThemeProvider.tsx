import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext, type Theme } from "./context";

const STORAGE_KEY = "ecom_theme";

function systemTheme(): Theme {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return systemTheme();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [explicit, setExplicit] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) != null;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // While the user hasn't chosen, keep following the OS.
  useEffect(() => {
    if (explicit) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setThemeState(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [explicit]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setExplicit(true);
    setThemeState(next);
  }, []);

  const toggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme],
  );

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
