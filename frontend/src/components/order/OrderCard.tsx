import { Link } from "react-router-dom";
import type { Order } from "@/types/api";
import { formatPrice } from "@/lib/currency";
import { GeneratedSleeve } from "@/components/ui/GeneratedSleeve";
import { OrderStatusBadge } from "./OrderStatusBadge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrderCard({ order }: { order: Order }) {
  const count = order.items.reduce((sum, i) => sum + i.quantity, 0);

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
            style={{ marginLeft: i === 0 ? 0 : "-1.75rem" }}
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
          <span className="font-sans text-xs font-semibold tabular-nums text-muted">
            LW-{order._id.slice(-6).toUpperCase()}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 font-sans text-sm text-ink tabular-nums">
          {count} record{count === 1 ? "" : "s"} — {formatPrice(order.total)}
        </p>
        <p className="font-sans text-xs text-muted">{formatDate(order.createdAt)}</p>
      </div>

      <span className="shrink-0 font-sans text-sm font-bold tabular-nums text-ink">
        {formatPrice(order.total)}
      </span>
    </Link>
  );
}
