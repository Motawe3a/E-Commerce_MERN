import { createContext } from "react";
import type { Lang, TKey } from "./dict";

export interface I18nValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nValue | null>(null);
