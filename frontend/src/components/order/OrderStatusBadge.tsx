import type { OrderStatus } from "@/types/api";
import { Badge } from "@/components/ui/Badge";

const tone: Record<OrderStatus, "ink" | "blue" | "spot" | "quiet"> = {
  placed: "blue",
  shipped: "ink",
  delivered: "ink",
  cancelled: "quiet",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={tone[status]}>{status}</Badge>;
}
