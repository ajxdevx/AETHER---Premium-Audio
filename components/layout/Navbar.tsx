"use client";

import { ShoppingBag } from "@/lib/icons";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { NAV_LINKS } from "@/constants/navigation";
import { Badge } from "@/components/ui/Badge";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { HeaderIconButton } from "@/components/layout/HeaderIconButton";
import { HeaderSearchBar } from "@/components/layout/HeaderSearchBar";
import { SearchNavDropdown } from "@/components/layout/SearchNavDropdown";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { FavoritesMenu } from "@/components/layout/FavoritesMenu";
import { Logo } from "@/components/ui/Logo";
import { NewBadge } from "@/components/ui/NewBadge";
import { Container } from "@/components/ui/Container";
import { NavLink } from "@/components/layout/NavLink";
import { MountReveal } from "@/components/home/SectionReveal";
import { useActiveNavLabel } from "@/hooks/useActiveNavLabel";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const activeLabel = useActiveNavLabel();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [widths, setWidths] = useState({ collapsed: 36, expanded: 280 });
  const [isXl, setIsXl] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const xlMq = window.matchMedia("(min-width: 1280px)");
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setIsXl(xlMq.matches);
      setIsMobile(mobileMq.matches);
    };
    sync();
    xlMq.addEventListener("change", sync);
    mobileMq.addEventListener("change", sync);
    return () => {
      xlMq.removeEventListener("change", sync);
      mobileMq.removeEventListener("change", sync);
    };
  }, []);

  const measureWidths = useCallback(() => {
    const logo = logoRef.current;
    const slot = slotRef.current;
    const nav = navRef.current;
    if (!logo || !slot || !nav) return;

    const logoRect = logo.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const padL = Number.parseFloat(getComputedStyle(nav).paddingLeft) || 8;

    const collapsed = isMobile
      ? 36
      : Math.round(slotRect.width || (isXl ? 320 : 280));

    const expanded = isMobile
      ? Math.round(Math.max(slotRect.right - navRect.left - padL, 160))
      : Math.round(
          Math.max(slotRect.right - logoRect.right - 12, collapsed)
        );

    setWidths({ collapsed, expanded });
  }, [isMobile, isXl]);

  useLayoutEffect(() => {
    measureWidths();
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths, pathname, searchExpanded, isXl, isMobile]);

  const expandSearch = useCallback(() => {
    measureWidths();
    setSearchExpanded(true);
  }, [measureWidths]);

  const collapseSearch = useCallback(() => {
    setSearchExpanded(false);
    setSearchQuery("");
  }, []);

  const showSearchDropdown =
    searchExpanded && searchQuery.trim().length > 0;
  const hideLogoForSearch = searchExpanded && !isXl;

  useLayoutEffect(() => {
    if (!showSearchDropdown && !searchExpanded) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        collapseSearch();
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
    };
  }, [showSearchDropdown, searchExpanded, collapseSearch]);

  return (
    <>
      <AnnouncementBar />

      <header className="bg-white pt-3 pb-2 md:pt-4 md:pb-4">
        <Container wide>
          <MountReveal delay={0.08} y={16}>
            <nav
              ref={navRef}
              className="relative z-40 flex h-[56px] min-w-0 items-center gap-1.5 rounded-full bg-brand-soft px-2 shadow-[0_8px_28px_-18px_rgba(80,60,20,0.28)] sm:h-[64px] sm:gap-3 sm:px-3 md:h-[72px] md:gap-5 md:px-4 lg:gap-6 lg:px-5"
              aria-label="Main"
            >
              <div
                ref={logoRef}
                className={cn(
                  "relative z-10 flex shrink-0 items-center pl-0.5 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:pl-1 md:pl-2 lg:pr-2",
                  hideLogoForSearch && "pointer-events-none opacity-0"
                )}
              >
                <Logo size="lg" />
              </div>

              <ul
                className={cn(
                  "mx-auto hidden items-center gap-0.5 lg:flex",
                  searchExpanded && "pointer-events-none"
                )}
              >
                {NAV_LINKS.map((link, index) => {
                  const active = activeLabel === link.label;
                  const staggerMs = searchExpanded
                    ? (NAV_LINKS.length - 1 - index) * 120
                    : index * 80;

                  return (
                    <li
                      key={link.label}
                      className={cn(
                        "transition-opacity duration-300 ease-out",
                        searchExpanded ? "opacity-0" : "opacity-100"
                      )}
                      style={{ transitionDelay: `${staggerMs}ms` }}
                    >
                      <NavLink
                        href={link.href}
                        tabIndex={searchExpanded ? -1 : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200",
                          active
                            ? "bg-brand text-white"
                            : "text-ink-warm hover:text-ink"
                        )}
                      >
                        {link.label}
                        {"badge" in link && link.badge ? (
                          <NewBadge
                            className={cn(
                              "px-1.5 py-0.5 text-[9px] tracking-wide",
                              active && "bg-white text-brand"
                            )}
                          />
                        ) : null}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <div
                ref={slotRef}
                className={cn(
                  "relative z-30 h-9 min-w-0",
                  isMobile
                    ? "ml-auto w-9 shrink-0"
                    : "min-w-0 flex-1 md:h-9 xl:w-full xl:max-w-[320px] xl:flex-none xl:shrink-0"
                )}
              >
                <div
                  className={cn(
                    "h-full min-w-0",
                    isMobile || isXl
                      ? "absolute top-0 right-0"
                      : "w-full max-w-full"
                  )}
                  style={
                    isMobile || isXl
                      ? {
                          width: searchExpanded
                            ? widths.expanded
                            : widths.collapsed,
                          transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
                        }
                      : undefined
                  }
                >
                  <HeaderSearchBar
                    expanded={searchExpanded}
                    onExpand={expandSearch}
                    onCollapse={collapseSearch}
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    shortPlaceholder={!isXl}
                    compact={isMobile}
                  />
                </div>
              </div>

              <div
                ref={iconsRef}
                className="relative z-20 flex shrink-0 items-center gap-1 sm:gap-2 md:gap-2.5"
              >
                <div className="relative">
                  <HeaderIconButton
                    label="Open cart"
                    className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12"
                    onClick={openCart}
                  >
                    <ShoppingBag size={18} strokeWidth={1.75} />
                  </HeaderIconButton>
                  <Badge count={itemCount} />
                </div>

                <FavoritesMenu />

                <AccountMenu />
              </div>

              {showSearchDropdown ? (
                <SearchNavDropdown
                  query={searchQuery}
                  onNavigate={collapseSearch}
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 w-full"
                />
              ) : null}
            </nav>

            <ul
              className={cn(
                "mt-2.5 flex w-full gap-1.5 lg:hidden",
                searchExpanded && "max-xl:hidden"
              )}
            >
              {NAV_LINKS.map((link) => {
                const active = activeLabel === link.label;
                return (
                  <li key={link.label} className="min-w-0 flex-1">
                    <NavLink
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex w-full items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-[11px] font-semibold transition-colors sm:gap-1 sm:px-2 sm:text-[12px]",
                        active
                          ? "bg-brand text-white"
                          : "bg-brand-soft text-ink-warm"
                      )}
                    >
                      <span className="truncate">{link.label}</span>
                      {"badge" in link && link.badge ? (
                        <NewBadge
                          className={cn(
                            "shrink-0 px-1.5 py-0.5 text-[8px] tracking-wide",
                            active && "bg-white text-brand"
                          )}
                        />
                      ) : null}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </MountReveal>
        </Container>
      </header>
    </>
  );
}
