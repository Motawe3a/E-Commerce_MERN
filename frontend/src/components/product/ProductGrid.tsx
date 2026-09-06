import type { Product } from "@/types/api";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";

const GRID = "grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={GRID}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-square border border-rule" />
          <div className="mt-3 flex justify-between gap-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
