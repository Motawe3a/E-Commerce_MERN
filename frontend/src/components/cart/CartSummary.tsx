import { formatPrice } from "@/lib/currency";

export function CartSummary({
  subtotal,
  itemCount,
  action,
}: {
  subtotal: number;
  itemCount: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-2 border-ink bg-card p-5">
      <h2 className="text-2xl">The bill</h2>
      <dl className="mt-4 font-sans text-sm">
        <div className="flex justify-between border-b border-rule py-2 text-muted">
          <dt>
            {itemCount} record{itemCount === 1 ? "" : "s"}
          </dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between border-b border-rule py-2 text-muted">
          <dt>Shipping</dt>
          <dd>Free</dd>
        </div>
        <div className="flex justify-between pt-3 text-ink">
          <dt className="font-display text-xl">Total</dt>
          <dd className="font-display text-xl tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
