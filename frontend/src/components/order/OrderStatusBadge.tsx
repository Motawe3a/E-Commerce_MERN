import type { OrderStatus } from "@/types/api";
import { Badge } from "@/components/ui/Badge";

const tone: Record<OrderStatus, "brand" | "amber" | "green" | "red"> = {
  placed: "brand",
  shipped: "amber",
  delivered: "green",
  cancelled: "red",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={tone[status]} className="capitalize">
      {status}
    </Badge>
  );
}
