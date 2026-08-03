"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import {
  getLocalHashTarget,
  handleNavLinkClick,
  isHomeSectionLink,
  isPlaceholderHref,
  navigateToHomeSection,
  navigateToPage,
  scrollToHashOnCurrentPage,
} from "@/lib/navScroll";
import { cn } from "@/lib/utils";

interface NavLinkProps extends ComponentProps<typeof Link> {
  href: string;
}

export function NavLink({ href, onClick, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isPlaceholder = isPlaceholderHref(href);

  return (
    <Link
      href={href}
      aria-disabled={isPlaceholder || undefined}
      className={cn(isPlaceholder && "cursor-pointer", className)}
      onClick={(event) => {
        if (isPlaceholder) {
          event.preventDefault();
          onClick?.(event);
          return;
        }

        const url = new URL(href, window.location.origin);
        const onSamePath = pathname === url.pathname;

        if (onSamePath) {
          handleNavLinkClick(href, event);
          onClick?.(event);
          return;
        }

        event.preventDefault();

        const localHash = getLocalHashTarget(href);
        if (localHash) {
          scrollToHashOnCurrentPage(pathname, localHash);
          onClick?.(event);
          return;
        }

        if (isHomeSectionLink(href)) {
          navigateToHomeSection(router, href);
        } else {
          navigateToPage(router, href);
        }

        onClick?.(event);
      }}
      {...props}
    />
  );
}
