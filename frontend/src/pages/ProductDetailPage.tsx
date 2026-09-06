import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Disc3 } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCart, useCartMutations } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import { recordMeta, conditionGrade } from "@/lib/vinyl";
import { Container } from "@/components/layout/Container";
import { Button, buttonClass } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { GeneratedSleeve } from "@/components/ui/GeneratedSleeve";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: cart } = useCart();
  const { addItem } = useCartMutations();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <Container className="py-14">
        <PageLoader label="Pulling the record" />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container className="py-14">
        <EmptyState
          icon={Disc3}
          title="Not in the racks"
          description="This record isn't in our system. It may have sold or been pulled."
          action={
            <Link to="/" className={buttonClass({ variant: "outline" })}>
              Back to catalog
            </Link>
          }
        />
      </Container>
    );
  }

  const meta = recordMeta(product);
  const inCrate =
    cart?.items.find((i) => i.productId === product._id)?.quantity ?? 0;
  const remaining = product.stock - inCrate;
  const soldOut = remaining <= 0;
  const { grade, note } = conditionGrade(product.stock);

  const specs = [
    ["Format", meta.format],
    ["Speed", meta.speed],
    ["Condition", `${grade} — ${note}`],
    ["Catalog no.", meta.catalogNo],
  ];

  return (
    <Container className="py-10 md:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Catalog
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,25rem)_1fr] lg:gap-16">
        <div className="h-fit border border-ink">
          <GeneratedSleeve product={product} priority />
        </div>

        <div>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)]">{product.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <Badge tone={soldOut ? "quiet" : "ink"}>{soldOut ? "Sold out" : grade}</Badge>
            <span
              className="inline-block bg-spot px-2 py-1 font-sans text-lg font-bold tabular-nums text-card"
              style={{ transform: "rotate(-2deg)" }}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          <dl className="mt-8 border-t border-ink">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-rule py-2.5">
                <dt className="font-sans text-sm text-muted">{k}</dt>
                <dd className="text-right font-sans text-sm font-semibold tabular-nums text-ink">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              max={Math.max(remaining, 1)}
              disabled={soldOut}
              onChange={setQuantity}
            />
            <Button
              size="lg"
              disabled={soldOut}
              isLoading={addItem.isPending}
              onClick={() => addItem.mutate({ productId: product._id, quantity })}
            >
              {soldOut ? "Sold out" : "Add to crate"}
            </Button>
          </div>

          {inCrate > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm text-ink">
              <Check className="size-4 text-spot" />
              {inCrate} in your crate
            </p>
          )}

          <p className="mt-6 max-w-md font-sans text-xs leading-relaxed text-muted">
            Every record is hand-graded and play-tested. VG+ means light surface
            marks that don't touch the sound. Ships in 3–5 days.
          </p>

          {product.description && (
            <div className="mt-10 border-t border-ink pt-6">
              <h2 className="text-xl">Liner notes</h2>
              <p className="mt-3 max-w-prose font-sans text-sm leading-relaxed text-ink/80">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
