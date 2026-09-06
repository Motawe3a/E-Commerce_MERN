import { Outlet } from "react-router-dom";
import { useI18n } from "@/i18n/useI18n";
import { Controls } from "./Controls";

/**
 * The shop window. Sign-in / register sit on one side; the other is one big
 * record sleeve — always a dark composition, so its colours are fixed.
 */
export function AuthLayout() {
  const { t } = useI18n();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#121210] px-6 py-8 text-paper sm:px-10 md:py-12 min-h-[36vh] lg:min-h-0">
        <div className="relative z-10">
          <h1 className="text-[clamp(3.5rem,11vw,8rem)] leading-[0.9]" dir="ltr">
            Dead
            <br />
            Wax
          </h1>
          <p className="mt-5 max-w-xs font-sans text-sm text-paper/75">
            {t("brand.tagline")}
          </p>
        </div>

        <p className="relative z-10 font-sans text-xs tracking-[0.14em] text-paper/50 uppercase">
          {t("brand.catNo")}
        </p>

        {/* disc bleeding off the corner (bottom-end) */}
        <div
          aria-hidden
          className="grooves animate-[spin_30s_linear_infinite] pointer-events-none absolute -bottom-[16%] [inset-inline-end:-14%] aspect-square w-[62%] rounded-full bg-[#241f1a] motion-reduce:animate-none"
        >
          <div className="absolute inset-[38%] rounded-full bg-spot" />
          <div className="absolute inset-[47%] rounded-full bg-[#121210]" />
        </div>
      </section>

      <section className="relative flex flex-col justify-center bg-card px-6 py-12 sm:px-12">
        <Controls className="absolute end-6 top-6" />
        <div className="mx-auto w-full max-w-sm flex-1 lg:flex-none lg:my-auto">
          <Outlet />
        </div>
        <p className="mx-auto mt-10 w-full max-w-sm font-sans text-xs text-muted">
          {t("brand.hours")}
        </p>
      </section>
    </div>
  );
}
