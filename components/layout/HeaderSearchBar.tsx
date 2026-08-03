"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "Search finishes, features, FAQs…";
/** Matches Navbar search width transition (`0.9s`). */
const SEARCH_EXPAND_MS = 900;

interface HeaderSearchBarProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  className?: string;
  /** Shorter placeholder for narrow headers. */
  shortPlaceholder?: boolean;
  /** Mobile: same icon stays put; only the bar expands left. */
  compact?: boolean;
}

export function HeaderSearchBar({
  expanded,
  onExpand,
  onCollapse,
  query,
  onQueryChange,
  className,
  shortPlaceholder = false,
  compact = false,
}: HeaderSearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const iconOnly = compact && !expanded;
  const [closeReady, setCloseReady] = useState(false);
  const showClose = expanded && closeReady;

  useEffect(() => {
    if (!expanded) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      const id = window.setTimeout(() => setCloseReady(true), 0);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => setCloseReady(true), SEARCH_EXPAND_MS);
    return () => window.clearTimeout(id);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onQueryChange("");
        onCollapse();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, onCollapse, onQueryChange]);

  const submit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    onQueryChange("");
    onCollapse();
  };

  return (
    <div
      className={cn("flex h-full w-full min-w-0 max-w-full items-center", className)}
      role="search"
    >
      <form
        className={cn(
          "header-search-form relative flex h-9 w-full min-w-0 max-w-full items-center overflow-hidden rounded-full bg-white outline-none",
          "hover:bg-white",
          "focus-within:bg-white focus-within:outline-none focus-within:shadow-none",
          compact && "header-search-compact",
          compact ? "p-0" : "py-0.5 pl-3 pr-1"
        )}
        onSubmit={(event) => {
          event.preventDefault();
          if (iconOnly) {
            onExpand();
            return;
          }
          submit();
        }}
        onClick={() => {
          if (!expanded) onExpand();
        }}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center",
            compact && "h-full pl-3 pr-9",
            iconOnly && "pointer-events-none opacity-0"
          )}
        >
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              onQueryChange(next);
              if (next.length > 0) onExpand();
            }}
            onFocus={onExpand}
            placeholder={
              shortPlaceholder || compact || expanded
                ? "Search products & FAQs…"
                : PLACEHOLDER
            }
            aria-label="Search products and FAQs"
            tabIndex={iconOnly ? -1 : 0}
            className={cn(
              "search-input min-w-0 flex-1 truncate bg-transparent text-[12px] text-ink placeholder:text-ink-soft md:text-[13px]",
              "border-0 shadow-none outline-none ring-0",
              "focus:border-0 focus:shadow-none focus:outline-none focus:ring-0",
              "focus-visible:border-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0",
              "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
              !compact && "w-full"
            )}
          />
          <button
            type="button"
            aria-label="Close search"
            tabIndex={showClose ? 0 : -1}
            aria-hidden={!showClose}
            onClick={(event) => {
              event.stopPropagation();
              onQueryChange("");
              onCollapse();
            }}
            className={cn(
              "flex shrink-0 cursor-pointer items-center justify-center rounded-full text-brand",
              "transition-[background-color,color,box-shadow,opacity] duration-300 ease-out",
              "brand-icon-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35",
              compact ? "h-8 w-8" : "mr-0.5 h-7 w-7",
              showClose
                ? "opacity-100"
                : "pointer-events-none w-0 overflow-hidden opacity-0"
            )}
          >
            <X size={14} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <button
          type="submit"
          aria-label={iconOnly ? "Open search" : "Submit search"}
          aria-controls="header-search-results"
          aria-expanded={expanded && query.trim().length > 0}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full hover:bg-transparent",
            compact
              ? "absolute right-0 top-0 h-9 w-9 text-brand"
              : "h-7 w-7 bg-brand text-white hover:bg-brand"
          )}
        >
          <Search
            size={compact ? 18 : 13}
            strokeWidth={compact ? 1.75 : 2}
            aria-hidden
          />
        </button>
      </form>
    </div>
  );
}
