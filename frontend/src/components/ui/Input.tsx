import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink",
      "placeholder:text-muted/70 transition-colors",
      "focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none",
      invalid ? "border-red-400" : "border-line",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink",
      "placeholder:text-muted/70 transition-colors",
      "focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none",
      invalid ? "border-red-400" : "border-line",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
