import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disc3 } from "lucide-react";
import { useCart, useCartMutations } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useI18n } from "@/i18n/useI18n";
import { Container } from "@/components/layout/Container";
import { Button, buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";

export function CartPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data: cart, isLoading, itemCount } = useCart();
  const { data: products } = useProducts();
  const { updateItem, removeItem, clear } = useCartMutations();

  const productsById = useMemo(
    () => new Map((products ?? []).map((p) => [p._id, p])),
    [products],
  );

  const busy = updateItem.isPending || removeItem.isPending || clear.isPending;

  if (isLoading) {
    return (
      <Container className="py-14">
        <PageLoader label={t("cart.loading")} />
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-14">
        <EmptyState
          icon={Disc3}
          title={t("cart.emptyTitle")}
          description={t("cart.emptyBody")}
          action={
            <Link to="/" className={buttonClass()}>
              {t("cart.browse")}
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-10 md:py-14">
      <div className="flex items-end justify-between border-b-2 border-ink pb-5">
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)]">{t("cart.title")}</h1>
        <button
          type="button"
          onClick={() => clear.mutate()}
          disabled={busy}
          className="font-sans text-sm font-semibold text-muted hover:text-spot-deep disabled:opacity-40"
        >
          {t("cart.empty")}
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,36rem)_19rem] lg:justify-between">
        <div>
          {cart.items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              product={productsById.get(item.productId)}
              busy={busy}
              onQuantityChange={(q) =>
                updateItem.mutate({ productId: item.productId, quantity: q })
              }
              onRemove={() => removeItem.mutate(item.productId)}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary
            subtotal={cart.totalAmount}
            itemCount={itemCount}
            action={
              <Button
                size="lg"
                className="w-full"
                disabled={busy}
                onClick={() => navigate("/checkout")}
              >
                {t("cart.checkout")}
              </Button>
            }
          />
        </div>
      </div>
    </Container>
  );
}
