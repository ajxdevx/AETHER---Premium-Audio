import { cn } from "@/lib/utils";

/** Brand wipe fill — pair with `group/btn relative overflow-hidden` on the button. */
export function ButtonWipeFill({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover/btn:scale-x-100",
        className
      )}
    />
  );
}
