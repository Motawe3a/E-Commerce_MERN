import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const field =
  "w-full bg-card font-sans text-sm text-ink placeholder:text-muted/60 " +
  "border border-ink/25 px-3.5 transition-colors " +
  "focus:border-ink focus:outline-none focus:ring-0 " +
  "aria-[invalid=true]:border-spot";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(field, "h-11", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(field, "py-2.5", className)} {...props} />
));
Textarea.displayName = "Textarea";
