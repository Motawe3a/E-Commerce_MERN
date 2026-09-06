import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div
      className={cn(
        "inline-flex h-11 items-center border-2 border-ink bg-card",
        disabled && "opacity-45",
        className,
      )}
    >
      <button
        type="button"
        aria-label="One fewer"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="flex size-10 items-center justify-center text-ink hover:bg-ink hover:text-card disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-9 text-center font-sans text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="One more"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className="flex size-10 items-center justify-center text-ink hover:bg-ink hover:text-card disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
