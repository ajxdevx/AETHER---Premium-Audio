"use client";

import Link from "next/link";
import { BRAND } from "@/constants/brand";
import { LOGO_GLYPHS, LOGO_WORD } from "@/constants/logoGlyphs";
import { handleNavLinkClick } from "@/lib/navScroll";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  light?: boolean;
  size?: "md" | "lg";
}

function DotLetter({
  letter,
  dot,
  gap,
}: {
  letter: string;
  dot: number;
  gap: number;
}) {
  const grid = LOGO_GLYPHS[letter];
  if (!grid) return null;

  const step = dot + gap;
  const width = 5 * step - gap;
  const height = 7 * step - gap;
  const r = dot / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block shrink-0"
      aria-hidden
    >
      {grid.flatMap((row, rowIndex) =>
        row.map((on, colIndex) =>
          on ? (
            <circle
              key={`${rowIndex}-${colIndex}`}
              cx={colIndex * step + r}
              cy={rowIndex * step + r}
              r={r}
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function Wordmark({
  dot,
  gap,
  letterGap,
  className,
}: {
  dot: number;
  gap: number;
  letterGap: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap: letterGap }}
      aria-hidden
    >
      {LOGO_WORD.split("").map((letter, index) => (
        <DotLetter
          key={`${letter}-${index}`}
          letter={letter}
          dot={dot}
          gap={gap}
        />
      ))}
    </span>
  );
}

export function Logo({ className, light = false, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={(event) => handleNavLinkClick("/", event)}
      className={cn(
        "inline-flex shrink-0 items-center",
        light ? "text-white" : "text-brand",
        className
      )}
      aria-label={`${BRAND.name} home`}
    >
      <span className="sr-only">{BRAND.name}</span>
      {size === "lg" ? (
        <>
          <Wordmark dot={2} gap={1.5} letterGap={4} className="md:hidden" />
          <Wordmark
            dot={4}
            gap={2}
            letterGap={8}
            className="hidden md:inline-flex"
          />
        </>
      ) : (
        <>
          <Wordmark dot={2} gap={1.5} letterGap={4} className="md:hidden" />
          <Wordmark
            dot={3}
            gap={2}
            letterGap={6}
            className="hidden md:inline-flex"
          />
        </>
      )}
    </Link>
  );
}
