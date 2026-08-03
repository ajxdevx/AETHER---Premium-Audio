"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "@/lib/icons";
import { BRAND, SIGNATURE_THEMES } from "@/constants/brand";
import { getIncludedBoxItems } from "@/lib/products";
import { Container } from "@/components/ui/Container";
import { NewBadge } from "@/components/ui/NewBadge";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { NavLink } from "@/components/layout/NavLink";
import { premiumEase, MountStagger, StaggerItem } from "@/components/home/SectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSignatureTheme } from "@/providers/SignatureThemeProvider";
import { loadHeroImage } from "@/lib/preloadHeroAssets";
import { cn } from "@/lib/utils";
import {
  HERO_PODS,
  HERO_POD_THEME_IDS,
  HERO_STAND,
  LISTENER_AVATARS,
  REVEAL_FALLBACK_MS,
} from "./hero/constants";
import { ColorSwatches } from "./hero/ColorSwatches";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { themeId, theme, setThemeId } = useSignatureTheme();
  const includedItems = getIncludedBoxItems(themeId);

  const [play, setPlay] = useState(false);
  const [swapReady, setSwapReady] = useState(false);
  const entranceReady = play || reduceMotion;
  const imageSwapReady = swapReady || reduceMotion;

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    const bootTheme = themeId;

    const ready = Promise.all([
      loadHeroImage(HERO_STAND),
      loadHeroImage(HERO_PODS[bootTheme]),
    ]);

    const fallback = window.setTimeout(() => {
      if (!cancelled) setPlay(true);
    }, REVEAL_FALLBACK_MS);

    ready.then(() => {
      if (cancelled) return;
      window.clearTimeout(fallback);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setPlay(true);
        });
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  useEffect(() => {
    if (!play || reduceMotion) return;
    const t = window.setTimeout(() => setSwapReady(true), 900);
    return () => window.clearTimeout(t);
  }, [play, reduceMotion]);

  return (
    <section
      id="hero"
      className={cn(
        "relative flex flex-col overflow-hidden bg-white",
        // Fit under announce + header (+ mobile link row) in one viewport.
        "h-[calc(100dvh-var(--chrome-mobile))] max-h-[calc(100dvh-var(--chrome-mobile))]",
        "sm:h-[calc(100dvh-var(--chrome-tablet))] sm:max-h-[calc(100dvh-var(--chrome-tablet))]",
        "lg:h-[calc(100dvh-var(--chrome-desktop))] lg:max-h-[calc(100dvh-var(--chrome-desktop))]"
      )}
    >
      <Container
        wide
        className="relative z-10 flex min-h-0 flex-1 flex-col gap-2 py-1.5 sm:gap-4 sm:py-4 lg:gap-4 lg:py-4"
      >
        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] items-stretch gap-2.5 sm:gap-4 lg:grid-cols-2 lg:grid-rows-none lg:items-stretch lg:gap-10 xl:gap-12">
          <MountStagger
            className="flex w-full min-w-0 shrink-0 flex-col justify-start lg:min-h-0 lg:justify-center lg:pr-4 xl:pr-10"
            stagger={0.08}
            delay={0.04}
            play={entranceReady}
          >
            <StaggerItem>
              <p className="inline-flex h-8 max-w-full items-center gap-2 rounded-full bg-brand-soft px-3 text-[12px] font-semibold leading-none text-brand sm:h-9 sm:px-3.5 sm:text-[13px] md:text-[14px]">
                {themeId === "green" ? (
                  <NewBadge className="shrink-0" />
                ) : null}
                <span className="min-w-0 truncate">
                  {themeId === "green"
                    ? "Matcha Green drop — limited release"
                    : `${theme.label} finish`}
                </span>
              </p>
            </StaggerItem>

            <StaggerItem>
              <h1 className="mt-1.5 text-[clamp(1.65rem,6.5vw,4.75rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-ink sm:mt-4 lg:mt-5">
                Feel Every Beat.
                <br />
                Live Every Moment.
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-1.5 max-w-[38rem] text-[13px] leading-[1.45] text-ink-muted sm:mt-5 sm:text-[17px] sm:leading-[1.6] md:text-[18px] lg:mt-6 lg:text-[19px]">
                {BRAND.name} delivers stunning high-fidelity audio, all-day comfort,
                and iconic style.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-2.5 flex w-full flex-row flex-wrap items-center gap-2 sm:mt-8 sm:gap-3.5 lg:mt-9">
                <NavLink
                  href="/#featured"
                  className="group/btn relative inline-flex h-10 min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-full bg-ink py-1 pl-4 pr-1 text-[13px] font-semibold text-white min-[420px]:h-12 min-[420px]:flex-none min-[420px]:justify-center sm:h-[3.5rem] sm:gap-2.5 sm:pl-8 sm:text-[15px] md:h-[3.75rem] md:gap-3 md:pl-9 md:pr-2 md:text-[16px]"
                >
                  <ButtonWipeFill />
                  <span className="relative z-[1]">Shop Pro Pods</span>
                  <span className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors duration-500 group-hover/btn:bg-white group-hover/btn:text-brand sm:h-10 sm:w-10 md:h-11 md:w-11">
                    <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
                  </span>
                </NavLink>
                <NavLink
                  href="/#featured"
                  className="btn-outline-soft h-10 flex-1 px-4 text-[13px] min-[420px]:h-12 min-[420px]:flex-none min-[420px]:px-6 sm:h-[3.5rem] sm:px-8 sm:text-[15px] md:h-[3.75rem] md:px-9 md:text-[16px]"
                >
                  Explore Colors
                </NavLink>
              </div>
            </StaggerItem>
          </MountStagger>

          <div className="relative mx-auto flex min-h-0 w-full max-w-[420px] flex-1 flex-col lg:mx-0 lg:h-full lg:max-w-none">
            <div className="relative min-h-0 w-full flex-1 overflow-hidden lg:min-h-0">
              <div
                className="pointer-events-none absolute left-[8%] top-[6%] z-[1] h-[82%] w-[82%] rounded-[46%] bg-brand-soft sm:left-[6%] sm:top-[4%] sm:h-[86%] sm:w-[86%]"
                aria-hidden
              />

              <div
                className="pointer-events-none absolute left-[36%] top-[16%] z-[2] hidden h-[55%] w-[48%] overflow-hidden sm:block"
                aria-hidden
              >
                <div
                  className="h-full w-full opacity-35"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, var(--brand-accent) 1.4px, transparent 1.6px)",
                    backgroundSize: "12px 12px",
                  }}
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 bottom-[6%] top-[36%]">
                  <Image
                    src={HERO_STAND}
                    alt=""
                    fill
                    priority
                    className="object-contain object-bottom scale-[1.15] sm:scale-[1.28] lg:scale-[1.35]"
                    sizes="(max-width: 1024px) 90vw, 50vw"
                  />
                </div>

                <div className="pointer-events-none absolute inset-x-[-2%] bottom-[-2%] top-[8%]">
                  <motion.div
                    className="absolute inset-0"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 40, scale: 0.9 }
                    }
                    animate={
                      play || reduceMotion
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 40, scale: 0.9 }
                    }
                    transition={{
                      duration: 0.85,
                      delay: play ? 0.06 : 0,
                      ease: premiumEase,
                    }}
                  >
                    <div
                      className={cn(
                        "absolute inset-0",
                        play && !reduceMotion && "hero-pods-float"
                      )}
                    >
                      {(imageSwapReady ? HERO_POD_THEME_IDS : [themeId]).map(
                        (id) => {
                          const active = themeId === id;
                          return (
                            <motion.div
                              key={id}
                              className="absolute inset-0"
                              initial={false}
                              animate={{ opacity: active ? 1 : 0 }}
                              transition={
                                reduceMotion
                                  ? { duration: 0.12 }
                                  : { duration: 0.25, ease: premiumEase }
                              }
                              style={{ zIndex: active ? 2 : 1 }}
                              aria-hidden={!active}
                            >
                              <Image
                                src={HERO_PODS[id]}
                                alt={
                                  active
                                    ? `AETHER Pro Pods in ${SIGNATURE_THEMES[id].label}`
                                    : ""
                                }
                                fill
                                priority={active}
                                className="object-contain object-center lg:scale-100"
                                sizes="(max-width: 1024px) 90vw, 50vw"
                              />
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="absolute right-2 top-[4%] z-30 hidden w-[10.25rem] lg:block">
                <ColorSwatches
                  themeId={themeId}
                  themeLabel={theme.label}
                  setThemeId={setThemeId}
                  animateEntrance
                  reduceMotion={reduceMotion}
                  play={play}
                />
              </div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
                animate={
                  play || reduceMotion
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 16, scale: 0.92 }
                }
                transition={{
                  duration: 0.6,
                  delay: play ? 0.42 : 0,
                  ease: premiumEase,
                }}
                className="absolute bottom-[14%] right-2 z-20 hidden lg:block"
              >
                <div className="flex w-[7.25rem] flex-col items-center justify-center rounded-[999px] bg-white px-4 py-6 shadow-[0_20px_44px_-24px_rgba(40,35,20,0.38)]">
                  <p className="text-[1.35rem] font-extrabold leading-none tracking-tight text-brand">
                    50K+
                  </p>
                  <p className="mt-1.5 px-1 text-center text-[11px] font-semibold leading-tight text-brand/80">
                    Happy listeners
                  </p>
                  <div className="mt-3 flex -space-x-2">
                    {LISTENER_AVATARS.map((src) => (
                      <span
                        key={src}
                        className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-brand-soft"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mx-auto mt-1 w-full max-w-[10.5rem] shrink-0 sm:mt-3 lg:hidden">
              <ColorSwatches
                themeId={themeId}
                themeLabel={theme.label}
                setThemeId={setThemeId}
                compact
                animateEntrance
                reduceMotion={reduceMotion}
                play={play}
              />
            </div>
          </div>
        </div>

        <motion.ul
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={
            play || reduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
          }
          transition={{
            duration: 0.6,
            delay: play ? 0.2 : 0,
            ease: premiumEase,
          }}
          className="relative z-20 -mx-4 flex shrink-0 gap-2 overflow-x-auto px-4 pb-0.5 sm:gap-2.5 sm:pb-1 md:mx-0 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0"
          aria-label="What's included with your Aether Pods"
        >
          {includedItems.map(({ label, description, image }) => (
            <li
              key={label}
              className="w-[8.5rem] shrink-0 sm:w-[9.75rem] md:w-auto md:min-w-0 md:flex-1"
            >
              <div className="flex h-[3.75rem] items-center gap-2 overflow-hidden rounded-[1rem] bg-surface-muted px-2 py-1.5 sm:h-[4.75rem] sm:gap-2.5 sm:rounded-[1.15rem] sm:px-2.5 sm:py-2 md:h-[5.25rem] md:gap-3 md:rounded-[1.2rem] md:px-3.5 md:py-2.5">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden sm:h-11 sm:w-11 md:h-12 md:w-12">
                  <Image
                    src={image}
                    alt={label}
                    fill
                    className="object-contain object-center"
                    sizes="48px"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold leading-tight text-ink sm:text-[12px] md:text-[14px]">
                    {label}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[9px] leading-snug text-ink-soft sm:line-clamp-2 sm:text-[10px] md:line-clamp-none md:truncate md:text-[12px]">
                    {description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
