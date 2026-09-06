import { Link } from "react-router-dom";
import type { Order } from "@/types/api";
import { formatPrice } from "@/lib/currency";
import { useI18n } from "@/i18n/useI18n";
import { GeneratedSleeve } from "@/components/ui/GeneratedSleeve";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderCard({ order }: { order: Order }) {
  const { t, lang } = useI18n();
  const count = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const date = new Date(order.createdAt).toLocaleDateString(
    lang === "ar" ? "ar" : "en",
    { year: "numeric", month: "short", day: "numeric" },
  );

  return (
    <Link
      to={`/orders/${order._id}`}
      className="flex items-center gap-4 border border-ink bg-card p-4 hover:bg-card/60"
    >
      <div className="flex shrink-0">
        {order.items.slice(0, 3).map((item, i) => (
          <div
            key={`${item.productId}-${i}`}
            className="w-14 border border-ink"
            style={{ marginInlineStart: i === 0 ? 0 : "-1.75rem" }}
          >
            <GeneratedSleeve
              compact
              product={{ _id: item.productId, title: item.title, image: item.image }}
            />
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-semibold tabular-nums text-muted" dir="ltr">
            LW-{order._id.slice(-6).toUpperCase()}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 font-sans text-sm text-ink tabular-nums">
          {t(count === 1 ? "orders.recordLine" : "orders.recordsLine", {
            n: count,
            price: formatPrice(order.total),
          })}
        </p>
        <p className="font-sans text-xs text-muted">{date}</p>
      </div>

      <span className="shrink-0 font-sans text-sm font-bold tabular-nums text-ink">
        {formatPrice(order.total)}
      </span>
    </Link>
  );
}
