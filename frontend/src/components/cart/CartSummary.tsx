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
    <div className="rounded-2xl border border-line bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-muted">
          <dt>Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-muted">
          <dt>Shipping</dt>
          <dd>Free</dd>
        </div>
        <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
