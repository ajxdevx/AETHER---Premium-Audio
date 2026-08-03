"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Play, X } from "@/lib/icons";
import { ProductVideoChrome } from "@/components/product/ProductVideoChrome";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getLenis } from "@/lib/smoothScroll";
import { loadGsap } from "@/lib/gsapClient";
import { cn } from "@/lib/utils";

type GsapTimeline = ReturnType<
  Awaited<ReturnType<typeof loadGsap>>["timeline"]
>;

type ProductOverviewMediaCardProps = {
  image: string;
  title: string;
  pastel: string;
  isLifestyle: boolean;
  colorId: string;
  /** Optional — wire up when videos are ready. */
  videoSrc?: string | null;
};

function getCenteredStage() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padY = vw < 640 ? 88 : 104;
  const widthRatio = vw < 640 ? 0.92 : vw < 1024 ? 0.74 : 0.52;
  const width = Math.min(vw * widthRatio, vw - (vw < 640 ? 28 : 72));
  const height = Math.min(width * (9 / 16), vh - padY * 2);
  return {
    top: (vh - height) / 2,
    left: (vw - width) / 2,
    width,
    height,
  };
}

function restorePageScroll(prevHtml?: string, prevBody?: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.overflow = prevHtml ?? "";
  document.body.style.overflow = prevBody ?? "";
  getLenis()?.start();
}

export function ProductOverviewMediaCard({
  image,
  title,
  pastel,
  isLifestyle,
  colorId,
  videoSrc = null,
}: ProductOverviewMediaCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stageBox, setStageBox] = useState(() => ({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }));

  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const closeWrapRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openTlRef = useRef<GsapTimeline | null>(null);
  const closeTlRef = useRef<GsapTimeline | null>(null);
  const aliveRef = useRef(true);
  const closingRef = useRef(false);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const stage = stageRef.current;
    const poster = posterRef.current;
    const meta = metaRef.current;
    const closeWrap = closeWrapRef.current;
    aliveRef.current = true;
    const mountedTimer = window.setTimeout(() => setMounted(true), 0);
    return () => {
      window.clearTimeout(mountedTimer);
      aliveRef.current = false;
      openTlRef.current?.kill();
      closeTlRef.current?.kill();
      openTlRef.current = null;
      closeTlRef.current = null;
      const nodes = [backdrop, stage, poster, meta, closeWrap].filter(Boolean);
      if (nodes.length) {
        void loadGsap().then((gsap) => gsap.killTweensOf(nodes));
      }
      restorePageScroll();
    };
  }, []);

  // Warm the video while the card is on screen so open → play is immediate.
  useEffect(() => {
    if (!videoSrc || typeof document === "undefined") return;
    const warm = document.createElement("video");
    warm.preload = "auto";
    warm.muted = true;
    warm.playsInline = true;
    warm.src = videoSrc;
    warm.load();
    return () => {
      warm.removeAttribute("src");
      warm.load();
    };
  }, [videoSrc]);


  const forceClose = useCallback(() => {
    openTlRef.current?.kill();
    closeTlRef.current?.kill();
    openTlRef.current = null;
    closeTlRef.current = null;
    closingRef.current = false;
    if (aliveRef.current) {
      setOpen(false);
      setShowVideo(false);
      setVideoReady(false);
    }
  }, []);

  const openPlayer = useCallback(() => {
    closingRef.current = false;
    setStageBox(getCenteredStage());
    setOpen(true);
  }, []);

  const animateClose = useCallback(async () => {
    if (closingRef.current || !open) return;
    closingRef.current = true;

    const backdrop = backdropRef.current;
    const stage = stageRef.current;
    const meta = metaRef.current;
    const closeWrap = closeWrapRef.current;

    if (!stage || reduceMotion) {
      forceClose();
      return;
    }

    openTlRef.current?.kill();
    closeTlRef.current?.kill();

    const gsap = await loadGsap();
    if (!stage.isConnected) return;
    const tl = gsap.timeline({
      defaults: { ease: "power3.in" },
      onComplete: () => {
        closeTlRef.current = null;
        if (!aliveRef.current) return;
        forceClose();
      },
    });
    closeTlRef.current = tl;

    tl.to(
      [meta, closeWrap].filter(Boolean),
      { opacity: 0, y: -8, duration: 0.2, ease: "power2.in" },
      0
    );
    tl.to(
      stage,
      {
        opacity: 0,
        scale: 0.94,
        y: 18,
        duration: 0.38,
        ease: "power3.in",
      },
      0.04
    );
    if (backdrop) {
      tl.to(backdrop, { opacity: 0, duration: 0.32, ease: "power2.in" }, 0.1);
    }
  }, [forceClose, open, reduceMotion]);

  useEscapeKey(open, animateClose);
  useFocusTrap(open, overlayRef, closeButtonRef);

  useEffect(() => {
    if (!open) return;

    const lenis = getLenis();
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    lenis?.stop();

    const onResize = () => {
      const next = getCenteredStage();
      setStageBox(next);
      const stage = stageRef.current;
      if (stage) {
        Object.assign(stage.style, {
          top: `${next.top}px`,
          left: `${next.left}px`,
          width: `${next.width}px`,
          height: `${next.height}px`,
        });
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      restorePageScroll(prevHtmlOverflow, prevBodyOverflow);
    };
  }, [open]);

  const revealVideoFromPoster = useCallback(async () => {
    if (!aliveRef.current || closingRef.current || videoReady) return;
    setVideoReady(true);
    const poster = posterRef.current;
    if (!poster || reduceMotion) {
      if (poster) poster.style.opacity = "0";
      return;
    }
    const gsap = await loadGsap();
    if (!poster.isConnected) return;
    gsap.to(poster, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [reduceMotion, videoReady]);

  useLayoutEffect(() => {
    if (!open) return;

    const backdrop = backdropRef.current;
    const stage = stageRef.current;
    const poster = posterRef.current;
    const meta = metaRef.current;
    const closeWrap = closeWrapRef.current;
    if (!backdrop || !stage) return;

    const target = getCenteredStage();
    setStageBox(target);
    setVideoReady(false);
    setShowVideo(true);

    let cancelled = false;
    let timeline: GsapTimeline | null = null;

    void loadGsap().then((gsap) => {
      if (cancelled || !stage.isConnected) return;
      openTlRef.current?.kill();
      closeTlRef.current?.kill();
      gsap.killTweensOf(
        [backdrop, stage, poster, meta, closeWrap].filter(Boolean)
      );

      if (reduceMotion) {
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(stage, {
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
        opacity: 1,
        scale: 1,
        y: 0,
      });
      // Keep poster until the video is actually playing — never flash black.
        gsap.set(poster, { opacity: 1 });
        gsap.set([meta, closeWrap].filter(Boolean), { opacity: 1, y: 0 });
        return;
      }

    // Fade/scale open — transform only, no layout morph.
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(stage, {
      top: target.top,
      left: target.left,
      width: target.width,
      height: target.height,
      opacity: 0,
      scale: 0.92,
      y: 28,
      transformOrigin: "50% 50%",
    });
    gsap.set(poster, { opacity: 1 });
    gsap.set([meta, closeWrap].filter(Boolean), { opacity: 0, y: 12 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline = tl;
      openTlRef.current = tl;

    tl.to(backdrop, { opacity: 1, duration: 0.45, ease: "power2.out" }, 0);
    tl.to(
      stage,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.75,
        ease: "expo.out",
      },
      0.08
    );
    tl.to(
      closeWrap,
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
      0.32
    );
    tl.to(
      meta,
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      0.36
    );

      if (!videoSrc && poster) {
        tl.to(poster, { opacity: 0, duration: 0.35, ease: "power2.out" }, 0.65);
      }
    });

    return () => {
      cancelled = true;
      timeline?.kill();
      if (openTlRef.current === timeline) openTlRef.current = null;
    };
  }, [open, reduceMotion, videoSrc]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPlayer}
        aria-label={`Play ${title} video`}
        className={cn(
          "group/media relative w-full min-w-0 cursor-pointer overflow-hidden rounded-[1.75rem] text-left outline-none",
          "focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
          isLifestyle
            ? "aspect-[4/5] min-h-[320px] sm:min-h-[420px] xl:aspect-auto xl:min-h-full"
            : "aspect-square sm:min-h-[280px] xl:aspect-auto xl:min-h-full"
        )}
        style={{ backgroundColor: pastel }}
      >
        {isLifestyle ? (
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 top-5 sm:top-6",
                colorId === "black" && "inset-x-[3%]"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-contain object-bottom transition-transform duration-700 ease-out group-hover/media:scale-[1.03]"
                sizes="(max-width: 1280px) 100vw, 40vw"
              />
            </div>
          </div>
        ) : (
          <Image
            src={image}
            alt=""
            fill
            className="object-contain object-center p-8 transition-transform duration-700 ease-out group-hover/media:scale-[1.03] sm:p-10"
            sizes="(max-width: 1280px) 100vw, 40vw"
            aria-hidden
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(26,26,26,0.18)_100%)]"
          aria-hidden
        />

        <span className="pointer-events-none absolute inset-0 z-[2] grid place-items-center">
          <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center sm:h-[5rem] sm:w-[5rem]">
            <span
              className="absolute inset-0 rounded-full border border-white/70 transition-transform duration-700 ease-out group-hover/media:scale-[1.12] group-hover/media:border-white"
              aria-hidden
            />
            <span
              className="absolute inset-[10px] rounded-full bg-white text-ink shadow-[0_22px_48px_-20px_rgba(26,26,26,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/media:scale-105"
              aria-hidden
            />
            <Play
              size={20}
              strokeWidth={2.25}
              className="relative z-[1] ml-0.5 fill-current text-ink"
              aria-hidden
            />
          </span>
        </span>
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={overlayRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="fixed inset-0 z-[90]"
            >
              <div
                ref={backdropRef}
                role="presentation"
                className="absolute inset-0 cursor-pointer bg-ink/40 backdrop-blur-sm"
                onClick={animateClose}
              />

              <div
                ref={closeWrapRef}
                className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex items-start justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:pt-8"
              >
                <div
                  ref={metaRef}
                  className="pointer-events-none max-w-[min(70vw,28rem)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
                    Watch
                  </p>
                  <p
                    id={titleId}
                    className="mt-1.5 font-[family-name:var(--font-announce)] text-[clamp(1.15rem,2.4vw,1.65rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white"
                  >
                    {title}
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close video player"
                  onClick={animateClose}
                  className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand transition-[background-color,color,box-shadow] duration-300 ease-out brand-icon-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              <div
                ref={stageRef}
                className="absolute z-[2] overflow-hidden will-change-transform"
                style={{
                  top: stageBox.top,
                  left: stageBox.left,
                  width: stageBox.width || undefined,
                  height: stageBox.height || undefined,
                  borderRadius: 18,
                  backgroundColor: pastel,
                  boxShadow:
                    "0 32px 90px -36px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] ring-1 ring-inset ring-black/5"
                  aria-hidden
                />

                <div
                  ref={posterRef}
                  className="pointer-events-none absolute inset-0 z-[4]"
                  style={{ backgroundColor: pastel }}
                  aria-hidden
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className={cn(
                      "object-contain",
                      isLifestyle ? "object-bottom p-2" : "object-center p-6"
                    )}
                    sizes="50vw"
                    fetchPriority="high"
                    loading="eager"
                  />
                </div>

                <div
                  className="absolute inset-0 z-[1]"
                  style={{ backgroundColor: pastel }}
                >
                  {showVideo && videoSrc ? (
                    <ProductVideoChrome
                      src={videoSrc}
                      poster={image}
                      title={title}
                      ready={videoReady}
                      onReady={revealVideoFromPoster}
                      stageColor={pastel}
                    />
                  ) : null}
                  {showVideo && !videoSrc ? (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8"
                      style={{ backgroundColor: pastel }}
                    >
                      <span className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-black/10 bg-white/70 text-ink backdrop-blur-md">
                        <Play
                          size={24}
                          strokeWidth={2}
                          className="ml-0.5 fill-current"
                          aria-hidden
                        />
                      </span>
                      <div className="relative text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-ink-soft">
                          Media
                        </p>
                        <p className="mt-2 font-[family-name:var(--font-announce)] text-[1.15rem] font-bold tracking-[-0.02em] text-ink sm:text-[1.25rem]">
                          Coming soon
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
