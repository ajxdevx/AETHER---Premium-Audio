"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "@/lib/icons";
import { SectionReveal } from "@/components/home/SectionReveal";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { cn } from "@/lib/utils";

const COMPARE_FINISHES = [
  { id: "pink", label: "Pink", short: "Pink", swatch: "#F7C4D8" },
  { id: "green", label: "Green", short: "Green", swatch: "#9CB87A" },
  { id: "blue", label: "Sky Blue", short: "Blue", swatch: "#B8DDF5" },
  { id: "black", label: "Space Dark", short: "Dark", swatch: "#1A1A1A" },
] as const;

type Cell = { type: "check" } | { type: "text"; value: string };

const checkAll = (): Cell[] => [
  { type: "check" },
  { type: "check" },
  { type: "check" },
  { type: "check" },
];

const textAll = (value: string): Cell[] => [
  { type: "text", value },
  { type: "text", value },
  { type: "text", value },
  { type: "text", value },
];

const COMPARE_ROWS: { label: string; cells: Cell[] }[] = [
  { label: "Features", cells: checkAll() },
  { label: "Active Noise Cancellation", cells: checkAll() },
  { label: "Transparency Mode", cells: checkAll() },
  { label: "Spatial Audio", cells: checkAll() },
  { label: "Battery Life", cells: textAll("Up to 20 hours") },
  { label: "Smart Case", cells: checkAll() },
  { label: "Weight", cells: textAll("384.8g") },
  { label: "Customizable Fit", cells: checkAll() },
  { label: "Sweat & Water Resistant", cells: checkAll() },
  { label: "Wireless Charging Case", cells: checkAll() },
];

const VISIBLE_COUNT = 5;
const PRIMARY_ROWS = COMPARE_ROWS.slice(0, VISIBLE_COUNT);
const EXTRA_ROWS = COMPARE_ROWS.slice(VISIBLE_COUNT);

const EASE = [0.22, 1, 0.36, 1] as const;

function CellValue({
  cell,
  compact,
}: {
  cell: Cell;
  compact?: boolean;
}) {
  if (cell.type === "check") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-brand-soft text-brand",
          compact ? "h-6 w-6" : "h-7 w-7"
        )}
      >
        <Check size={compact ? 13 : 15} strokeWidth={2.75} aria-hidden />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-medium tabular-nums text-ink",
        compact ? "text-[11px] leading-tight" : "text-[13px] sm:text-[14px]"
      )}
    >
      {cell.value}
    </span>
  );
}

function CompareRow({
  label,
  cells,
  isLast,
}: {
  label: string;
  cells: Cell[];
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(140px,1.4fr)_repeat(4,minmax(96px,1fr))] items-center border-b border-brand-soft",
        isLast && "border-b-0"
      )}
    >
      <div className="px-5 py-4 text-[13px] font-medium text-ink-label sm:px-6 sm:text-[14px]">
        {label}
      </div>
      {cells.map((cell, i) => (
        <div
          key={`${label}-${COMPARE_FINISHES[i].id}`}
          className="flex items-center justify-center px-3 py-4 sm:px-4"
        >
          <CellValue cell={cell} />
        </div>
      ))}
    </div>
  );
}

function MobileCompareRow({
  label,
  cells,
  isLast,
}: {
  label: string;
  cells: Cell[];
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-b border-brand-soft px-4 py-3.5",
        isLast && "border-b-0"
      )}
    >
      <p className="text-[12px] font-semibold text-ink-label">{label}</p>
      <div className="mt-2.5 grid grid-cols-4 gap-1.5">
        {cells.map((cell, i) => (
          <div
            key={`${label}-m-${COMPARE_FINISHES[i].id}`}
            className="flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-1"
          >
            <span className="sr-only">{COMPARE_FINISHES[i].label}</span>
            <CellValue cell={cell} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompareMaxGrid() {
  const [expanded, setExpanded] = useState(false);

  return (
    <SectionReveal y={28} className="mt-14 lg:mt-16">
      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        <div className="md:hidden" role="table" aria-label="Compare all Aether Pods finishes">
          <div className="border-b border-brand-soft px-4 py-5">
            <p className="whitespace-nowrap font-[family-name:var(--font-announce)] text-[clamp(1.05rem,4.2vw,1.2rem)] font-bold leading-tight tracking-tight text-ink">
              Compare All Aether Pods
            </p>
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              {COMPARE_FINISHES.map((finish) => (
                <div
                  key={finish.id}
                  className="flex min-w-0 flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full ring-1 ring-black/10",
                      finish.id === "black" && "ring-black/25"
                    )}
                    style={{ backgroundColor: finish.swatch }}
                    aria-hidden
                  />
                  <span className="truncate text-[11px] font-semibold text-ink">
                    {finish.short}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {PRIMARY_ROWS.map((row, i) => (
              <MobileCompareRow
                key={row.label}
                label={row.label}
                cells={row.cells}
                isLast={!expanded && i === PRIMARY_ROWS.length - 1}
              />
            ))}
          </div>

          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
            aria-hidden={!expanded}
          >
            <div>
              {EXTRA_ROWS.map((row, i) => (
                <MobileCompareRow
                  key={row.label}
                  label={row.label}
                  cells={row.cells}
                  isLast={i === EXTRA_ROWS.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="hidden max-w-full md:block">
          <div className="max-w-full overflow-x-auto overscroll-x-contain">
            <div
              className="min-w-[640px]"
              role="table"
              aria-label="Compare all Aether Pods finishes"
            >
              <div
                role="row"
                className="grid grid-cols-[minmax(140px,1.4fr)_repeat(4,minmax(96px,1fr))] items-end border-b border-brand-soft"
              >
                <div role="columnheader" className="px-5 py-5 sm:px-6 sm:py-6">
                  <span className="whitespace-nowrap font-[family-name:var(--font-announce)] text-[1.15rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.35rem]">
                    Compare All Aether Pods
                  </span>
                </div>
                {COMPARE_FINISHES.map((finish) => (
                  <div
                    key={finish.id}
                    role="columnheader"
                    className="flex flex-col items-center gap-2 px-3 py-5 sm:px-4 sm:py-6"
                  >
                    <span
                      className={cn(
                        "h-3.5 w-3.5 rounded-full ring-1 ring-black/10",
                        finish.id === "black" && "ring-black/25"
                      )}
                      style={{ backgroundColor: finish.swatch }}
                      aria-hidden
                    />
                    <span className="text-[12px] font-semibold text-ink sm:text-[13px]">
                      {finish.label}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                {PRIMARY_ROWS.map((row, i) => (
                  <CompareRow
                    key={row.label}
                    label={row.label}
                    cells={row.cells}
                    isLast={!expanded && i === PRIMARY_ROWS.length - 1}
                  />
                ))}
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: expanded ? "auto" : 0,
                  opacity: expanded ? 1 : 0,
                }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
                aria-hidden={!expanded}
              >
                <div>
                  {EXTRA_ROWS.map((row, i) => (
                    <CompareRow
                      key={row.label}
                      label={row.label}
                      cells={row.cells}
                      isLast={i === EXTRA_ROWS.length - 1}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-soft px-5 py-5 sm:px-6 sm:py-6">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="group/btn relative flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-surface-warm px-5 text-[13px] font-semibold text-ink transition-colors duration-300 hover:text-white sm:h-[3.25rem] sm:text-[14px]"
          >
            <ButtonWipeFill />
            <span className="relative z-[1]">
              {expanded ? "Show Less" : "View Full Comparison"}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2.25}
              className={cn(
                "relative z-[1] transition-transform duration-300",
                expanded && "rotate-180"
              )}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </SectionReveal>
  );
}
