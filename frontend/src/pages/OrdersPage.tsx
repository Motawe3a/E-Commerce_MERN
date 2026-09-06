import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Disc3, Receipt } from "lucide-react";
import { getOrders } from "@/api/orders";
import { useI18n } from "@/i18n/useI18n";
import { queryKeys } from "@/lib/queryClient";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { OrderCard } from "@/components/order/OrderCard";

export function OrdersPage() {
  const { t } = useI18n();
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: getOrders,
  });

  return (
    <Container className="py-10 md:py-14">
      <h1 className="border-b-2 border-ink pb-5 text-[clamp(2.5rem,7vw,4.5rem)]">
        {t("orders.title")}
      </h1>

      <div className="mt-8">
        {isLoading ? (
          <PageLoader label={t("orders.loading")} />
        ) : isError ? (
          <EmptyState
            icon={Receipt}
            title={t("orders.errTitle")}
            description={t("orders.errBody")}
          />
        ) : !orders || orders.length === 0 ? (
          <EmptyState
            icon={Disc3}
            title={t("orders.emptyTitle")}
            description={t("orders.emptyBody")}
            action={
              <Link to="/" className={buttonClass()}>
                {t("cart.browse")}
              </Link>
            }
          />
        ) : (
          <div className="grid max-w-3xl gap-3">
            {orders.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
