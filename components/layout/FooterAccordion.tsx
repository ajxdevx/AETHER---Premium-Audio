"use client";

import { useState } from "react";
import { ChevronDown } from "@/lib/icons";
import { NavLink } from "@/components/layout/NavLink";
import { cn } from "@/lib/utils";

export function FooterAccordion({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-brand-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 py-3.5 text-left"
      >
        <span className="text-[14px] font-bold tracking-wide text-ink">
          {title}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden
          className={cn(
            "shrink-0 text-brand transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2.5 pb-4">
            {links.map((link) => (
              <li key={link.label}>
                <NavLink
                  href={link.href}
                  className={cn(
                    "text-[13px] text-ink-muted",
                    link.href !== "#" &&
                      "transition-colors duration-200 hover:text-ink"
                  )}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
