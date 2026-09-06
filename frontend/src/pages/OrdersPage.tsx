import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Disc3, Receipt } from "lucide-react";
import { getOrders } from "@/api/orders";
import { queryKeys } from "@/lib/queryClient";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { OrderCard } from "@/components/order/OrderCard";

export function OrdersPage() {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: getOrders,
  });

  return (
    <Container className="py-10 md:py-14">
      <h1 className="border-b-2 border-ink pb-5 text-[clamp(2.5rem,7vw,4.5rem)]">
        Order history
      </h1>

      <div className="mt-8">
        {isLoading ? (
          <PageLoader label="Reading the receipts" />
        ) : isError ? (
          <EmptyState
            icon={Receipt}
            title="Couldn't load orders"
            description="Refresh to try again."
          />
        ) : !orders || orders.length === 0 ? (
          <EmptyState
            icon={Disc3}
            title="No orders yet"
            description="Once you check out, every order shows up here as a receipt."
            action={
              <Link to="/" className={buttonClass()}>
                Browse the catalog
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
