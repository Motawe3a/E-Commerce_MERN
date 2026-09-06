import { useState } from "react";
import { cn } from "@/lib/cn";

// Inline SVG placeholder — the seeded products point at a dead image host.
const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#eef2ff"/>
      <path d="M120 250l45-55 35 42 30-35 50 63H120z" fill="#c7d2fe"/>
      <circle cx="160" cy="150" r="26" fill="#c7d2fe"/>
    </svg>`,
  );

export function ProductImage({
  src,
  alt,
  className,
}: {
  src: string | undefined;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={!src || failed ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
