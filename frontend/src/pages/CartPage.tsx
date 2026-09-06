import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart, useCartMutations } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/auth/useAuth";
import { Container } from "@/components/layout/Container";
import { Button, buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: cart, isLoading, itemCount } = useCart();
  const { data: products } = useProducts();
  const { updateItem, removeItem, clear } = useCartMutations();

  const productsById = useMemo(
    () => new Map((products ?? []).map((p) => [p._id, p])),
    [products],
  );

  const busy =
    updateItem.isPending || removeItem.isPending || clear.isPending;

  if (!isAuthenticated) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is waiting"
          description="Log in to view your cart and check out."
          action={
            <Link to="/login?next=%2Fcart" className={buttonClass()}>
              Log in
            </Link>
          }
        />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="py-10">
        <PageLoader label="Loading your cart…" />
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse the catalog and add a few things."
          action={
            <Link to="/products" className={buttonClass()}>
              Start shopping
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Your cart</h1>
        <button
          type="button"
          onClick={() => clear.mutate()}
          disabled={busy}
          className="text-sm font-medium text-muted hover:text-red-600 disabled:opacity-50"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="divide-y divide-line rounded-2xl border border-line bg-white px-5">
          {cart.items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              product={productsById.get(item.productId)}
              busy={busy}
              onQuantityChange={(quantity) =>
                updateItem.mutate({ productId: item.productId, quantity })
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
                className="w-full"
                size="lg"
                onClick={() => navigate("/checkout")}
                disabled={busy}
              >
                Checkout
              </Button>
            }
          />
        </div>
      </div>
    </Container>
  );
}
