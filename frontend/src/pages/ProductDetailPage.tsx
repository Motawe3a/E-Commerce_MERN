import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, PackageX, ShoppingCart } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCart, useCartMutations } from "@/hooks/useCart";
import { useAuth } from "@/auth/useAuth";
import { formatPrice } from "@/lib/currency";
import { Container } from "@/components/layout/Container";
import { Button, buttonClass } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: cart } = useCart();
  const { addItem } = useCartMutations();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <Container className="py-10">
        <PageLoader label="Loading product…" />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="This product may have been removed."
          action={
            <Link to="/products" className={buttonClass({ variant: "secondary" })}>
              Back to products
            </Link>
          }
        />
      </Container>
    );
  }

  const inCart =
    cart?.items.find((item) => item.productId === product._id)?.quantity ?? 0;
  const remaining = product.stock - inCart;
  const outOfStock = remaining <= 0;

  function handleAdd() {
    if (!isAuthenticated) {
      navigate(`/login?next=${encodeURIComponent(`/products/${product!._id}`)}`);
      return;
    }
    addItem.mutate({ productId: product!._id, quantity });
  }

  return (
    <Container className="py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        All products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-line bg-white">
          <div className="aspect-square">
            <ProductImage src={product.image} alt={product.title} />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            {product.title}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-ink">
            {formatPrice(product.price)}
          </p>

          <div className="mt-3">
            {outOfStock ? (
              <Badge tone="red">Out of stock</Badge>
            ) : product.stock <= 5 ? (
              <Badge tone="amber">Only {product.stock} left in stock</Badge>
            ) : (
              <Badge tone="green">In stock</Badge>
            )}
          </div>

          {product.description && (
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              max={Math.max(remaining, 1)}
              disabled={outOfStock}
              onChange={setQuantity}
            />
            <Button
              onClick={handleAdd}
              isLoading={addItem.isPending}
              disabled={outOfStock}
              size="lg"
            >
              <ShoppingCart className="size-4" />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>
          </div>

          {inCart > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-700">
              <Check className="size-4" />
              {inCart} already in your cart
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
