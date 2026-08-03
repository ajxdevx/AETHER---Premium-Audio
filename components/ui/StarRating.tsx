import { Star } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

/** Compact 5-star display shared by product cards and detail views. */
export function StarRating({ rating, size = 13, className }: StarRatingProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-hidden
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating - i >= 0.5;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled
                ? "fill-star text-star"
                : "fill-none text-[#C8C4BC]"
            )}
          />
        );
      })}
    </div>
  );
}
