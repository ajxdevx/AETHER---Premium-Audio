import { cn } from "@/lib/utils";

interface BadgeProps {
  count: number;
  className?: string;
}

export function Badge({ count, className }: BadgeProps) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
        className
      )}
      aria-label={`${count} items in cart`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
