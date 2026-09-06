import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Order } from "@/types/api";
import { formatPrice } from "@/lib/currency";
import { ProductImage } from "@/components/ui/ProductImage";
import { OrderStatusBadge } from "./OrderStatusBadge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to={`/orders/${order._id}`}
      className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex -space-x-3">
        {order.items.slice(0, 3).map((item, i) => (
          <div
            key={`${item.productId}-${i}`}
            className="size-12 overflow-hidden rounded-xl border-2 border-white bg-canvas"
          >
            <ProductImage src={item.image} alt={item.title} />
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted">
            #{order._id.slice(-8)}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-ink">
          {itemCount} item{itemCount === 1 ? "" : "s"} &middot;{" "}
          {formatPrice(order.total)}
        </p>
        <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
      </div>

      <ChevronRight className="size-5 shrink-0 text-muted" />
    </Link>
  );
}
