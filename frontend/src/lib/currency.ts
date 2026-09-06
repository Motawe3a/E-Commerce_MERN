const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Format a numeric price (backend stores plain numbers, e.g. 100 -> "$100.00"). */
export function formatPrice(value: number): string {
  return formatter.format(Number.isFinite(value) ? value : 0);
}
