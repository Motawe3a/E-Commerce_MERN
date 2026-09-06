import type { OrderStatus } from "@/types/api";
import { useI18n } from "@/i18n/useI18n";
import { Badge } from "@/components/ui/Badge";
import type { TKey } from "@/i18n/dict";

const tone: Record<OrderStatus, "ink" | "blue" | "spot" | "quiet"> = {
  placed: "blue",
  shipped: "ink",
  delivered: "ink",
  cancelled: "quiet",
};

const key: Record<OrderStatus, TKey> = {
  placed: "status.placed",
  shipped: "status.shipped",
  delivered: "status.delivered",
  cancelled: "status.cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useI18n();
  return <Badge tone={tone[status]}>{t(key[status])}</Badge>;
}
