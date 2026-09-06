import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogOut, Menu, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button, buttonClass } from "@/components/ui/Button";
import { Container } from "./Container";
import { cn } from "@/lib/cn";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products", end: false },
];

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <ShoppingBag className="size-4" />
          </span>
          Storefront
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted hover:text-ink",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex size-10 items-center justify-center rounded-xl text-muted hover:bg-black/5 hover:text-ink"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <User className="size-4" />
                  {user?.email}
                </span>
                <Button size="sm" variant="secondary" onClick={logout}>
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={buttonClass({ variant: "ghost", size: "sm" })}
                >
                  Log in
                </Link>
                <Link to="/register" className={buttonClass({ size: "sm" })}>
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-muted hover:bg-black/5 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div className="border-t border-line bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted hover:text-ink",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-line pt-3">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <span className="px-3 text-sm text-muted">{user?.email}</span>
                  <Button variant="secondary" onClick={logout}>
                    <LogOut className="size-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="rounded-xl border border-line px-3 py-2.5 text-center text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
