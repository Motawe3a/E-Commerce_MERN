import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package, PackageX } from "lucide-react";
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
    <Container className="py-10">
      <h1 className="text-2xl font-bold text-ink">Your orders</h1>

      <div className="mt-6">
        {isLoading ? (
          <PageLoader label="Loading orders…" />
        ) : isError ? (
          <EmptyState
            icon={PackageX}
            title="Couldn't load orders"
            description="Please refresh to try again."
          />
        ) : !orders || orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you check out, your orders will show up here."
            action={
              <Link to="/products" className={buttonClass()}>
                Browse products
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
