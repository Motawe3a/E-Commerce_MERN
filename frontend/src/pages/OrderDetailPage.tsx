import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Disc3 } from "lucide-react";
import { getOrder } from "@/api/orders";
import { useI18n } from "@/i18n/useI18n";
import { queryKeys } from "@/lib/queryClient";
import { formatPrice } from "@/lib/currency";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { GeneratedSleeve } from "@/components/ui/GeneratedSleeve";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const { data: order, isLoading, isError } = useQuery({
    queryKey: queryKeys.order(id ?? ""),
    queryFn: () => getOrder(id as string),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <Container className="py-14">
        <PageLoader label={t("order.loading")} />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container className="py-14">
        <EmptyState
          icon={Disc3}
          title={t("order.missingTitle")}
          description={t("order.missingBody")}
          action={
            <Link to="/orders" className={buttonClass({ variant: "outline" })}>
              {t("order.backToOrders")}
            </Link>
          }
        />
      </Container>
    );
  }

  const placedOn = new Date(order.createdAt).toLocaleString(
    lang === "ar" ? "ar" : "en",
    { dateStyle: "medium", timeStyle: "short" },
  );

  return (
    <Container className="py-10 md:py-14">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" />
        {t("order.back")}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-b-2 border-ink pb-5">
        <h1 className="text-[clamp(2rem,6vw,3.5rem)]" dir="ltr">
          LW-{order._id.slice(-6).toUpperCase()}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 font-sans text-sm text-muted">
        {t("order.placedOn", { date: placedOn })}
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 border border-ink px-2 py-1 font-sans text-xs font-semibold text-ink">
        <Check className="size-3.5 text-spot" />
        {t("order.payment", { status: t("status.paid") })}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="border-t border-ink">
          {order.items.map((item, i) => (
            <div
              key={`${item.productId}-${i}`}
              className="flex gap-4 border-b border-rule py-4"
            >
              <div className="w-16 border border-ink">
                <GeneratedSleeve
                  compact
                  product={{ _id: item.productId, title: item.title, image: item.image }}
                />
              </div>
              <div className="flex flex-1 items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 font-sans text-xs text-muted tabular-nums">
                    {t("order.lineQty", {
                      price: formatPrice(item.unitPrice),
                      n: item.quantity,
                    })}
                  </p>
                </div>
                <p className="font-sans text-sm font-bold tabular-nums text-ink">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="border-2 border-ink bg-card p-5">
            <div className="flex justify-between">
              <span className="font-display text-xl">{t("order.paid")}</span>
              <span className="font-display text-xl tabular-nums">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
          <div className="border border-ink bg-card p-5">
            <h2 className="text-lg">{t("order.shippedTo")}</h2>
            <p className="mt-2 font-sans text-sm text-muted">{order.address}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
