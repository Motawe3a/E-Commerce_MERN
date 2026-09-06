import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, PackageX } from "lucide-react";
import { getOrder } from "@/api/orders";
import { queryKeys } from "@/lib/queryClient";
import { formatPrice } from "@/lib/currency";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { ProductImage } from "@/components/ui/ProductImage";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useQuery({
    queryKey: queryKeys.order(id ?? ""),
    queryFn: () => getOrder(id as string),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <Container className="py-10">
        <PageLoader label="Loading order…" />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={PackageX}
          title="Order not found"
          description="We couldn't find this order on your account."
          action={
            <Link to="/orders" className={buttonClass({ variant: "secondary" })}>
              Back to orders
            </Link>
          }
        />
      </Container>
    );
  }

  const placedOn = new Date(order.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Container className="py-10">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-ink">
          Order #{order._id.slice(-8)}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm text-muted">Placed on {placedOn}</p>

      <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="size-4" />
        Payment {order.paymentStatus}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="divide-y divide-line rounded-2xl border border-line bg-white px-5">
          {order.items.map((item, i) => (
            <div key={`${item.productId}-${i}`} className="flex gap-4 py-5">
              <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas">
                <ProductImage src={item.image} alt={item.title} />
              </div>
              <div className="flex flex-1 items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatPrice(item.unitPrice)} &times; {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink tabular-nums">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">Total</h2>
            <div className="mt-3 flex justify-between text-base font-semibold text-ink">
              <span>Paid</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">Shipping to</h2>
            <p className="mt-2 text-sm text-muted">{order.address}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
