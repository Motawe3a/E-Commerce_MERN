import { useMemo, useState } from "react";
import { Disc3, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";

type SortKey = "new" | "price-asc" | "price-desc" | "title";

const sorts: { value: SortKey; label: string }[] = [
  { value: "new", label: "Just in" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "title", label: "A–Z" },
];

export function CatalogPage() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("new");
  const [inStock, setInStock] = useState(false);

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
    if (inStock) list = list.filter((p) => p.stock > 0);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [products, search, sort, inStock]);

  return (
    <Container className="py-10 md:py-14">
      <header className="border-b-2 border-ink pb-6">
        <h1 className="text-[clamp(2.75rem,8vw,5.5rem)]">The Catalog</h1>
        <p className="mt-2 max-w-lg font-sans text-sm text-muted">
          {products
            ? `${products.length} pressings in the racks right now. New, used, and the odd rarity.`
            : "Pulling the racks…"}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the racks"
            className="h-10 pl-9"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-10 border border-ink/25 bg-card px-2 font-sans text-sm text-ink focus:border-ink focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-ink/25 bg-card px-3 font-sans text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="size-4 accent-spot"
          />
          In stock
        </label>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <EmptyState
            icon={Disc3}
            title="The racks won't load"
            description="Couldn't reach the shop. Check the backend is running and try again."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nothing matches"
            description="No records fit that search. Loosen the filters and dig again."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setInStock(false);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <ProductGrid products={visible} />
            <p className="mt-12 border-t border-rule pt-4 font-sans text-xs text-muted">
              That's everything on the floor. Fresh pressings land Fridays.
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
