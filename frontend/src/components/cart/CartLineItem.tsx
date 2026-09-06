import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { CartItem, Product } from "@/types/api";
import { formatPrice } from "@/lib/currency";
import { useI18n } from "@/i18n/useI18n";
import { GeneratedSleeve } from "@/components/ui/GeneratedSleeve";
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
  const { t } = useI18n();
  const title = product?.title ?? t("cart.unavailable");
  const maxQty = Math.max(product?.stock ?? item.quantity, item.quantity);

  return (
    <div className="grid grid-cols-[4rem_1fr] items-start gap-4 border-b border-rule py-5 last:border-b-0 sm:grid-cols-[4rem_1fr_auto]">
      <Link to={`/products/${item.productId}`} className="block border border-ink">
        <GeneratedSleeve
          compact
          product={{ _id: item.productId, title, image: product?.image ?? "" }}
        />
      </Link>

      <div className="min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="font-sans text-sm font-semibold text-ink hover:underline"
        >
          {title}
        </Link>
        <p className="mt-0.5 font-sans text-xs text-muted tabular-nums">
          {t("cart.each", { price: formatPrice(item.unitPrice) })}
        </p>
        <button
          type="button"
          onClick={onRemove}
          disabled={busy}
          className="mt-2 inline-flex items-center gap-1 font-sans text-xs font-semibold text-muted hover:text-spot-deep disabled:opacity-40"
        >
          <X className="size-3.5" />
          {t("cart.remove")}
        </button>
      </div>

      <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-3 sm:flex-col sm:items-end sm:justify-start">
        <QuantityStepper
          value={item.quantity}
          max={maxQty}
          disabled={busy}
          onChange={onQuantityChange}
        />
        <p className="font-sans text-sm font-bold tabular-nums text-ink">
          {formatPrice(item.unitPrice * item.quantity)}
        </p>
      </div>
    </div>
  );
}
