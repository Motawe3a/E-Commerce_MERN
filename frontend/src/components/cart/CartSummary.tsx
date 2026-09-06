import { formatPrice } from "@/lib/currency";
import { useI18n } from "@/i18n/useI18n";

export function CartSummary({
  subtotal,
  itemCount,
  action,
}: {
  subtotal: number;
  itemCount: number;
  action?: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="border-2 border-ink bg-card p-5">
      <h2 className="text-2xl">{t("bill.title")}</h2>
      <dl className="mt-4 font-sans text-sm">
        <div className="flex justify-between border-b border-rule py-2 text-muted">
          <dt>{t(itemCount === 1 ? "bill.record" : "bill.records", { n: itemCount })}</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between border-b border-rule py-2 text-muted">
          <dt>{t("bill.shipping")}</dt>
          <dd>{t("bill.free")}</dd>
        </div>
        <div className="flex justify-between pt-3 text-ink">
          <dt className="font-display text-xl">{t("bill.total")}</dt>
          <dd className="font-display text-xl tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
