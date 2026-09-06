import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

const links = [
  { to: "/", label: "Catalog", end: true },
  { to: "/orders", label: "Orders", end: false },
];

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-board">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl leading-none tracking-wide">
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
                  isActive ? "text-ink underline decoration-spot decoration-2" : "text-muted hover:text-ink",
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
            Crate<span className="text-spot"> ({itemCount})</span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <span className="hidden max-w-[22ch] truncate font-sans text-xs text-muted lg:inline">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={logout}
              className="border-2 border-ink px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.06em] hover:bg-ink hover:text-card"
            >
              Sign out
            </button>
          </div>

          <button
            type="button"
            aria-label="Menu"
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
              <span className="font-sans text-xs text-muted">{user?.email}</span>
              <button
                type="button"
                onClick={logout}
                className="border-2 border-ink px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.06em]"
              >
                Sign out
              </button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
