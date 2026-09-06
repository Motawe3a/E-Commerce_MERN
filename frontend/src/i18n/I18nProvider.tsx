import { useCallback, useEffect, useMemo, useState } from "react";
import { dict, type Lang, type TKey } from "./dict";
import { I18nContext } from "./context";

const STORAGE_KEY = "ecom_lang";

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    /* ignore */
  }
  return typeof navigator !== "undefined" && navigator.language.startsWith("ar")
    ? "ar"
    : "en";
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) =>
      interpolate(dict[lang][key] ?? dict.en[key] ?? key, vars),
    [lang],
  );

  const value = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);

  return <I18nContext value={value}>{children}</I18nContext>;
}
