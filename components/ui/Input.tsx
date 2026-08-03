import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const inputClassName =
  "w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-ink shadow-none ring-0 outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-0 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(inputClassName, invalid && "border-brand", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
