"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigation";

/** Home hash links → section id for scroll spy */
const HOME_SECTION_BY_LABEL: Record<string, string> = {
  Experience: "spotlights",
  Reviews: "reviews",
};

function sectionIdsInNavOrder() {
  return NAV_LINKS.map((link) => HOME_SECTION_BY_LABEL[link.label]).filter(
    Boolean,
  ) as string[];
}

/**
 * Which header nav item is selected:
 * - Shop on /shop and /product
 * - Home at top of homepage
 * - Otherwise the homepage section currently in view
 */
export function useActiveNavLabel() {
  const pathname = usePathname();
  const [homeActiveLabel, setHomeActiveLabel] = useState("Home");

  useEffect(() => {
    if (pathname !== "/") return;

    const ids = sectionIdsInNavOrder();
    const topOffset = 140;

    const pick = () => {
      const y = window.scrollY;

      if (y < 80) {
        setHomeActiveLabel("Home");
        return;
      }

      let current = "Home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - topOffset <= 0) {
          const label =
            Object.entries(HOME_SECTION_BY_LABEL).find(([, sid]) => sid === id)?.[0] ??
            "Home";
          current = label;
        }
      }

      setHomeActiveLabel(current);
    };

    const initialFrame = window.requestAnimationFrame(pick);
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [pathname]);

  if (pathname.startsWith("/shop") || pathname.startsWith("/product")) {
    return "Shop";
  }
  return pathname === "/" ? homeActiveLabel : "";
}
