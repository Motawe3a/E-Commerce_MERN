import { Link } from "react-router-dom";
import type { Product } from "@/types/api";
import { formatPrice } from "@/lib/currency";
import { conditionGrade } from "@/lib/vinyl";
import { useI18n } from "@/i18n/useI18n";
import { GeneratedSleeve } from "@/components/ui/GeneratedSleeve";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const { grade } = conditionGrade(product.stock);
  const soldOut = product.stock <= 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative">
        {/* the record, tucked behind the sleeve */}
        <div
          aria-hidden
          className="grooves absolute top-[8%] left-1/2 aspect-square w-[86%] -translate-x-1/2 rounded-full bg-vinyl transition-transform duration-300 ease-out group-hover:-translate-y-[14%] motion-reduce:transition-none"
        >
          <div className="absolute inset-[43%] rounded-full bg-spot" />
        </div>

        <div className="relative border border-ink transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none">
          <GeneratedSleeve product={product} />
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-sans text-sm font-semibold text-ink group-hover:underline">
            {product.title}
          </h3>
          <div className="mt-1">
            <Badge tone={soldOut ? "quiet" : "ink"}>
              {soldOut ? t("product.soldOut") : <span dir="ltr">{grade}</span>}
            </Badge>
          </div>
        </div>
        <span className="shrink-0 font-sans text-sm font-bold tabular-nums text-ink">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}
