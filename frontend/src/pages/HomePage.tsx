import { Link } from "react-router-dom";
import { ArrowRight, PackageX, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";

const perks = [
  { icon: Truck, title: "Free shipping", copy: "On every order, no minimum." },
  { icon: Undo2, title: "Easy returns", copy: "30-day, no-questions returns." },
  { icon: ShieldCheck, title: "Secure checkout", copy: "Payments are mocked here." },
];

export function HomePage() {
  const { data: products, isLoading, isError } = useProducts();
  const featured = products?.slice(0, 8) ?? [];

  return (
    <div>
      <section className="border-b border-line bg-white">
        <Container className="grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              New season, new stock
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Everything you need, delivered fast.
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              Browse the catalog, fill your cart, and check out in seconds. A
              small demo storefront built on a REST API.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className={buttonClass({ size: "lg" })}>
                Shop all products
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-100 via-brand-50 to-white" />
            <div className="absolute inset-6 rounded-2xl border border-brand-200/60" />
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <perk.icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{perk.title}</p>
                <p className="text-xs text-muted">{perk.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-ink">Featured products</h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <EmptyState
            icon={PackageX}
            title="Couldn't load products"
            description="The catalog failed to load. Make sure the backend is running, then refresh."
          />
        ) : featured.length === 0 ? (
          <EmptyState
            icon={PackageX}
            title="No products yet"
            description="The catalog is empty."
          />
        ) : (
          <ProductGrid products={featured} />
        )}
      </Container>
    </div>
  );
}
