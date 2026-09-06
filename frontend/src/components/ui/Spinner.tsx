import { cn } from "@/lib/cn";

/** A spinning record. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grooves relative inline-block size-5 animate-spin rounded-full bg-vinyl align-middle",
        className,
      )}
      style={{ animationDuration: "1.6s" }}
    >
      <span className="absolute inset-[42%] rounded-full bg-spot" />
    </span>
  );
}

export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-muted">
      <Spinner className="size-8" />
      <p className="font-sans text-sm">{label}</p>
    </div>
  );
}
