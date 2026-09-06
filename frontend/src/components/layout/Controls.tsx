import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/useI18n";
import { useTheme } from "@/theme/useTheme";
import { cn } from "@/lib/cn";

/** Language (EN / ع) + light-dark switches. Used in the header and on auth pages. */
export function Controls({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex border border-ink"
        role="group"
        aria-label={t("controls.language")}
      >
        {(["en", "ar"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={cn(
              "px-2 py-1 font-sans text-xs font-bold",
              lang === code
                ? "bg-ink text-card"
                : "bg-transparent text-ink hover:bg-ink/10",
            )}
          >
            {code === "en" ? "EN" : "ع"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={theme === "dark" ? t("controls.light") : t("controls.dark")}
        className="flex size-8 items-center justify-center border border-ink text-ink hover:bg-ink hover:text-card"
      >
        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    </div>
  );
}
