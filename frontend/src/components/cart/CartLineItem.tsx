import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { CartItem, Product } from "@/types/api";
import { formatPrice } from "@/lib/currency";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

export function CartLineItem({
  item,
  product,
  busy,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  product: Product | undefined;
  busy: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  const title = product?.title ?? "Product unavailable";
  const maxQty = Math.max(product?.stock ?? item.quantity, item.quantity);
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div className="flex gap-4 py-5">
      <Link
        to={`/products/${item.productId}`}
        className="size-20 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas"
      >
        <ProductImage src={product?.image} alt={title} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="line-clamp-1 text-sm font-medium text-ink hover:underline"
          >
            {title}
          </Link>
          <p className="mt-0.5 text-xs text-muted">
            {formatPrice(item.unitPrice)} each
          </p>
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
          <QuantityStepper
            value={item.quantity}
            max={maxQty}
            disabled={busy}
            onChange={onQuantityChange}
          />
          <p className="text-sm font-semibold text-ink tabular-nums">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
