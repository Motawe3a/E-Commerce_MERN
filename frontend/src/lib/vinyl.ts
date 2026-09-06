import type { Product } from "@/types/api";

/**
 * The catalog has no real cover art or press data, so we derive a stable,
 * shop-flavoured identity for each record from its id. Same id -> same result.
 */

function hash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SLEEVES = [
  { bg: "#121210", fg: "#e7e3d6", kicker: "#e0301d" }, // vinyl black
  { bg: "#e0301d", fg: "#f4efe4", kicker: "#121210" }, // spot
  { bg: "#1c357a", fg: "#e9e5d4", kicker: "#e0301d" }, // ink blue
  { bg: "#d7ccb2", fg: "#1b1a16", kicker: "#b3230f" }, // oat
  { bg: "#1b1a16", fg: "#d99a2b", kicker: "#e7e3d6" }, // amber on black
] as const;

const SPEEDS = ['33⅓ RPM', '45 RPM', '33⅓ RPM'] as const;
const FORMATS = ['12" LP', '12" LP', '2×LP', '7" Single'] as const;

export interface RecordMeta {
  sleeve: (typeof SLEEVES)[number];
  /** 0-2, picks a type-layout variant for the generated sleeve. */
  layout: number;
  /** small type tilt in degrees, -3..3 */
  tilt: number;
  catalogNo: string;
  format: string;
  speed: string;
}

export function recordMeta(product: Pick<Product, "_id">): RecordMeta {
  const h = hash(product._id);
  return {
    sleeve: SLEEVES[h % SLEEVES.length]!,
    layout: (h >> 4) % 3,
    tilt: ((h >> 7) % 7) - 3,
    catalogNo: `LW-${String((h % 8999) + 1000)}`,
    format: FORMATS[(h >> 9) % FORMATS.length]!,
    speed: SPEEDS[(h >> 11) % SPEEDS.length]!,
  };
}

/** Sleeve condition grade, standing in for real stock levels. */
export function conditionGrade(stock: number): { grade: string; note: string } {
  if (stock <= 0) return { grade: "—", note: "Out of stock" };
  if (stock === 1) return { grade: "NM", note: "Last copy" };
  if (stock <= 4) return { grade: "VG+", note: `${stock} copies in the bin` };
  return { grade: "VG+", note: "In stock" };
}
