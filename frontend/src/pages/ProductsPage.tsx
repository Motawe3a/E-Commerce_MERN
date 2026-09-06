import { useMemo, useState } from "react";
import { PackageX, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/product/ProductGrid";

type SortKey = "featured" | "price-asc" | "price-desc" | "title";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title", label: "Name: A–Z" },
];

export function ProductsPage() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const visible = useMemo(() => {
    let list = products ?? [];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }
    if (inStockOnly) list = list.filter((p) => p.stock > 0);

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [products, search, sort, inStockOnly]);

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold text-ink">All products</h1>
      <p className="mt-1 text-sm text-muted">
        {products ? `${products.length} products` : "Loading catalog…"}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-10"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-11 rounded-xl border border-line bg-white px-3 text-sm text-ink focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="size-4 accent-brand-600"
          />
          In stock
        </label>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <EmptyState
            icon={PackageX}
            title="Couldn't load products"
            description="The catalog failed to load. Check that the backend is running."
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matches"
            description="Try a different search term or clear the filters."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setInStockOnly(false);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ProductGrid products={visible} />
        )}
      </div>
    </Container>
  );
}
