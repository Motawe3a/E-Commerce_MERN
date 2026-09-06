import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start border-2 border-dashed border-rule bg-card px-6 py-14",
        className,
      )}
    >
      <Icon className="size-7 text-ink" strokeWidth={1.5} />
      <h2 className="mt-4 font-display text-3xl">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md font-sans text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
