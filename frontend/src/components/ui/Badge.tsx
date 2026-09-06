import { cn } from "@/lib/cn";

type Tone = "ink" | "spot" | "blue" | "quiet";

const tones: Record<Tone, string> = {
  ink: "border-ink text-ink",
  spot: "border-spot bg-spot text-card",
  blue: "border-blue text-blue",
  quiet: "border-rule text-muted",
};

/** Small bordered tag — used for condition grades (NM, VG+) and status. */
export function Badge({
  tone = "ink",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 font-sans text-[0.6875rem] font-bold tracking-[0.06em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
