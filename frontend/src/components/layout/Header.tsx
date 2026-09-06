import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Controls } from "./Controls";

export function Header() {
  const { logout } = useAuth();
  const { itemCount } = useCart();
  const { t } = useI18n();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: t("nav.catalog"), end: true },
    { to: "/orders", label: t("nav.orders"), end: false },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-board">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          dir="ltr"
          className="font-display text-2xl leading-none tracking-wide"
        >
          Dead Wax
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "font-sans text-sm font-semibold uppercase tracking-[0.06em] underline-offset-8",
                  isActive
                    ? "text-ink underline decoration-spot decoration-2"
                    : "text-muted hover:text-ink",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="font-sans text-sm font-semibold uppercase tracking-[0.06em] text-ink hover:text-spot-deep"
          >
            {t("nav.crate")}{" "}
            <span className="text-spot" dir="ltr">
              ({itemCount})
            </span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Controls />
            <button
              type="button"
              onClick={logout}
              className="border-2 border-ink px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.06em] hover:bg-ink hover:text-card"
            >
              {t("nav.signOut")}
            </button>
          </div>

          <button
            type="button"
            aria-label={t("nav.menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-rule bg-board md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "py-2 font-sans text-sm font-semibold uppercase tracking-[0.06em]",
                    isActive ? "text-ink" : "text-muted",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-rule pt-3">
              <Controls />
              <button
                type="button"
                onClick={logout}
                className="border-2 border-ink px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.06em]"
              >
                {t("nav.signOut")}
              </button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
