import { Outlet } from "react-router-dom";

/**
 * The shop window. Sign-in / register sit on the right; the left is one big
 * record sleeve — the first thing anyone sees.
 */
export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-vinyl px-6 py-8 text-card sm:px-10 md:py-12 min-h-[36vh] lg:min-h-0">
        <div className="relative z-10">
          <h1 className="text-[clamp(3.5rem,11vw,8rem)] leading-[0.9]">
            Dead
            <br />
            Wax
          </h1>
          <p className="mt-5 max-w-xs font-sans text-sm text-card/75">
            New, used &amp; rare pressings. Members only — the good stuff stays
            behind the counter.
          </p>
        </div>

        <p className="relative z-10 font-sans text-xs tracking-[0.14em] text-card/50 uppercase">
          Cat. LW-001 &nbsp;/&nbsp; Est. 2009
        </p>

        {/* disc bleeding off the corner */}
        <div
          aria-hidden
          className="grooves animate-[spin_30s_linear_infinite] pointer-events-none absolute -right-[14%] -bottom-[16%] aspect-square w-[62%] rounded-full bg-ink motion-reduce:animate-none"
        >
          <div className="absolute inset-[38%] rounded-full bg-spot" />
          <div className="absolute inset-[47%] rounded-full bg-vinyl" />
        </div>
      </section>

      <section className="flex flex-col justify-center bg-card px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm flex-1 lg:flex-none lg:my-auto">
          <Outlet />
        </div>
        <p className="mx-auto mt-10 w-full max-w-sm font-sans text-xs text-muted">
          Open Tue–Sun, 11–7. 214 Marlow Rd.
        </p>
      </section>
    </div>
  );
}
