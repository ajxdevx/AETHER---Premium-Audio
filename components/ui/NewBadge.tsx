import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Matches the New badge on Our Products cards. */
export const NEW_BADGE_CLASS =
  "inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand shadow-[0_4px_14px_-8px_rgba(40,35,20,0.35)] backdrop-blur-[2px]";

export function NewBadge({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={cn(NEW_BADGE_CLASS, className)} style={style}>
      New
    </span>
  );
}
