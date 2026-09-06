import { Link } from "react-router-dom";
import type { Product } from "@/types/api";
import { formatPrice } from "@/lib/currency";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <ProductImage
          src={product.image}
          alt={product.title}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock ? (
          <span className="absolute top-3 left-3">
            <Badge tone="red">Out of stock</Badge>
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute top-3 left-3">
            <Badge tone="amber">Only {product.stock} left</Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-medium text-ink">
          {product.title}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted">
            {product.description}
          </p>
        )}
        <p className="mt-3 text-base font-semibold text-ink">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
