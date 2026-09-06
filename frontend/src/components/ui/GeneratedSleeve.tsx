import { useState } from "react";
import type { Product } from "@/types/api";
import { recordMeta } from "@/lib/vinyl";
import { cn } from "@/lib/cn";

function hasRealArt(src: string | undefined): src is string {
  return Boolean(src) && !/via\.placeholder|placehold|example\.com/.test(src!);
}

function monogram(title: string): string {
  const parts = title.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] ?? "").join("").toUpperCase() || "?";
}

/**
 * Square record sleeve. Uses the product's cover art when it has real art;
 * otherwise composes a typographic sleeve from a stable per-record palette.
 * `compact` strips it back to a colour block + monogram for small thumbnails.
 */
export function GeneratedSleeve({
  product,
  className,
  compact,
  priority,
}: {
  product: Pick<Product, "_id" | "title" | "image">;
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const meta = recordMeta(product);
  const showArt = hasRealArt(product.image) && !failed;

  if (showArt) {
    return (
      <div className={cn("aspect-square overflow-hidden bg-vinyl", className)}>
        <img
          src={product.image}
          alt={product.title}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const { sleeve, layout, tilt, catalogNo } = meta;

  if (compact) {
    return (
      <div
        className="@container flex aspect-square items-center justify-center"
        style={{ backgroundColor: sleeve.bg, color: sleeve.fg }}
        role="img"
        aria-label={product.title}
      >
        <span className="font-display text-[38cqw] leading-none">
          {monogram(product.title)}
        </span>
      </div>
    );
  }

  const align =
    layout === 0 ? "items-end" : layout === 1 ? "items-start" : "items-center";

  return (
    <div
      className={cn("@container relative aspect-square overflow-hidden", className)}
      style={{ backgroundColor: sleeve.bg, color: sleeve.fg }}
      role="img"
      aria-label={product.title}
    >
      <span
        className="pointer-events-none absolute inset-[6%] border"
        style={{ borderColor: "currentColor", opacity: 0.22 }}
      />

      <div className={cn("flex h-full flex-col justify-between p-[8%]", align)}>
        <span
          className="font-sans text-[7cqw] font-semibold tracking-wide uppercase"
          style={{ color: sleeve.kicker }}
        >
          {catalogNo}
        </span>

        <span
          className="font-display text-[15cqw] leading-[0.88] uppercase"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          {product.title}
        </span>

        <span className="font-sans text-[6cqw] font-medium tracking-[0.18em] uppercase opacity-70">
          Dead Wax
        </span>
      </div>
    </div>
  );
}
