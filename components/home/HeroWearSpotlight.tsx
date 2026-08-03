"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SIGNATURE_THEMES } from "@/constants/brand";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSpotlightMagneticHover } from "@/hooks/useSpotlightMagneticHover";
import { loadGsap } from "@/lib/gsapClient";
import { cn } from "@/lib/utils";
import {
  WEAR_CYCLE_MS,
  WEAR_HOVER_MQ,
  WEAR_VARIANTS,
} from "./heroWear/wearVariants";
import {
  buildWearFramedBitmap,
  drawWearPixelated,
  loadWearImage,
} from "./heroWear/wearCanvas";

const CYCLE_MS = WEAR_CYCLE_MS;
const HOVER_MQ = WEAR_HOVER_MQ;

function ColorDots({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)} aria-hidden>
      {WEAR_VARIANTS.map((item, i) => (
        <span
          key={item.id}
          className={cn(
            "h-2 w-2 rounded-full",
            i === index ? "opacity-100" : "opacity-45"
          )}
          style={{ backgroundColor: SIGNATURE_THEMES[item.id].accent }}
        />
      ))}
    </div>
  );
}

function HeroWearSpotlight() {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mediaWrapRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const framedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tinyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameKeyRef = useRef("");
  const drawModeRef = useRef<"cover" | "contain">("cover");
  const canHoverRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const variant = WEAR_VARIANTS[index];

  useSpotlightMagneticHover(cardRef, {
    mediaZoom: false,
    copyMotion: canHover,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      WEAR_VARIANTS.map(async (v) => {
        const img = await loadWearImage(v.image);
        if (!cancelled) imagesRef.current.set(v.image, img);
      })
    ).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const paint = useCallback(
    (img: HTMLImageElement, block: number, fit = 1) => {
      const canvas = canvasRef.current;
      const wrap = mediaWrapRef.current;
      if (!canvas || !wrap) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Layout size only — ignore CSS hover scale so framing stays stable.
      const w = Math.max(1, Math.round(wrap.clientWidth));
      const h = Math.max(1, Math.round(wrap.clientHeight));
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!framedCanvasRef.current) {
        framedCanvasRef.current = document.createElement("canvas");
      }
      if (!tinyCanvasRef.current) {
        tinyCanvasRef.current = document.createElement("canvas");
      }

      const mode = drawModeRef.current;
      const key = `${img.src}|${w}x${h}|${fit}|${mode}`;
      if (frameKeyRef.current !== key) {
        buildWearFramedBitmap(img, w, h, fit, mode, framedCanvasRef.current);
        frameKeyRef.current = key;
      }

      drawWearPixelated(
        ctx,
        framedCanvasRef.current,
        w,
        h,
        Math.max(1, block),
        tinyCanvasRef.current
      );
    },
    []
  );

  useEffect(() => {
    const mq = window.matchMedia(HOVER_MQ);
    const sync = () => {
      canHoverRef.current = mq.matches;
      setCanHover(mq.matches);
      drawModeRef.current = "cover";
      const current = WEAR_VARIANTS[indexRef.current];
      const currentImg = imagesRef.current.get(current.image);
      if (currentImg && !busyRef.current) {
        paint(currentImg, 1, current.fit ?? 1);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [paint]);

  const morphTo = useCallback(
    async (nextIndex: number) => {
      if (busyRef.current || nextIndex === indexRef.current) return;
      const next = WEAR_VARIANTS[nextIndex];
      const current = WEAR_VARIANTS[indexRef.current];
      const card = cardRef.current;
      const titleEl = titleRef.current;
      const bodyEl = bodyRef.current;
      const labelEl = labelRef.current;
      const veilEl = veilRef.current;

      let nextImg = imagesRef.current.get(next.image);
      let currentImg = imagesRef.current.get(current.image);
      try {
        if (!nextImg) {
          nextImg = await loadWearImage(next.image);
          imagesRef.current.set(next.image, nextImg);
        }
        if (!currentImg) {
          currentImg = await loadWearImage(current.image);
          imagesRef.current.set(current.image, currentImg);
        }
      } catch {
        indexRef.current = nextIndex;
        setIndex(nextIndex);
        return;
      }

      if (reduceMotion || !card || !titleEl || !bodyEl || !labelEl) {
        indexRef.current = nextIndex;
        setIndex(nextIndex);
        if (card) card.style.backgroundColor = next.bg;
        paint(nextImg, 1, next.fit ?? 1);
        return;
      }

      const gsap = await loadGsap();
      if (!card.isConnected) return;
      busyRef.current = true;
      const state = { block: 1 };
      const currentFit = current.fit ?? 1;
      const nextFit = next.fit ?? 1;
      const nextAccent = SIGNATURE_THEMES[next.id].accent;
      const peakBlock = 22;

      const tl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        onComplete: () => {
          busyRef.current = false;
        },
      });

      tl.to(state, {
        block: peakBlock,
        duration: 0.55,
        ease: "power1.in",
        onUpdate: () => paint(currentImg!, state.block, currentFit),
      });

      tl.to(
        [labelEl, titleEl, bodyEl],
        {
          opacity: 0,
          y: 10,
          filter: "blur(6px)",
          duration: 0.32,
          ease: "power2.in",
          stagger: 0.03,
        },
        0.12
      );

      if (veilEl) {
        tl.to(
          veilEl,
          {
            opacity: 0.22,
            backgroundColor: nextAccent,
            duration: 0.28,
            ease: "sine.out",
          },
          0.3
        );
      }

      tl.add(() => {
        indexRef.current = nextIndex;
        setIndex(nextIndex);
        frameKeyRef.current = "";
        gsap.to(card, {
          backgroundColor: next.bg,
          duration: 0.55,
          ease: "sine.inOut",
        });
        state.block = peakBlock;
        paint(nextImg!, state.block, nextFit);
        labelEl.textContent = SIGNATURE_THEMES[next.id].label;
        titleEl.textContent = next.title;
        bodyEl.textContent = next.body;
        gsap.set([labelEl, titleEl, bodyEl], {
          opacity: 0,
          y: -10,
          filter: "blur(6px)",
        });
      });

      tl.to(state, {
        block: 1,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => paint(nextImg!, state.block, nextFit),
      });

      if (veilEl) {
        tl.to(
          veilEl,
          { opacity: 0, duration: 0.45, ease: "sine.out" },
          "-=0.55"
        );
      }

      tl.to(
        [labelEl, titleEl, bodyEl],
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.04,
        },
        "-=0.45"
      );
    },
    [paint, reduceMotion]
  );

  useLayoutEffect(() => {
    const draw = async () => {
      let ready = imagesRef.current.get(WEAR_VARIANTS[0].image);
      if (!ready) {
        ready = await loadWearImage(WEAR_VARIANTS[0].image);
        imagesRef.current.set(WEAR_VARIANTS[0].image, ready);
      }
      paint(ready, 1, WEAR_VARIANTS[0].fit ?? 1);
    };
    void draw();

    const wrap = mediaWrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const current = WEAR_VARIANTS[indexRef.current];
      const currentImg = imagesRef.current.get(current.image);
      if (currentImg && !busyRef.current) {
        paint(currentImg, 1, current.fit ?? 1);
      }
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint]);

  useEffect(() => {
    const shouldCycle = canHover ? hovered : true;
    if (!shouldCycle || reduceMotion) return;

    let intervalId = 0;
    const firstId = window.setTimeout(
      () => {
        if (busyRef.current) return;
        void morphTo((indexRef.current + 1) % WEAR_VARIANTS.length);
        intervalId = window.setInterval(() => {
          if (busyRef.current) return;
          void morphTo((indexRef.current + 1) % WEAR_VARIANTS.length);
        }, CYCLE_MS);
      },
      canHover ? 420 : 900
    );

    return () => {
      window.clearTimeout(firstId);
      window.clearInterval(intervalId);
    };
  }, [canHover, hovered, morphTo, reduceMotion]);

  const onEnter = () => {
    if (!canHoverRef.current) return;
    setHovered(true);
  };

  const onLeave = () => {
    if (!canHoverRef.current) return;
    setHovered(false);
    void morphTo(0);
  };

  return (
    <article
      ref={cardRef}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={cn(
        "relative isolate grid h-[36.5rem] cursor-pointer grid-cols-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[22px]",
        "sm:h-full sm:min-h-[28rem] sm:grid-cols-2 sm:grid-rows-none sm:rounded-[28px]",
        "will-change-transform"
      )}
      style={{ backgroundColor: variant.bg }}
      aria-label={`${variant.title} — ${SIGNATURE_THEMES[variant.id].label}`}
    >
      <div
        data-spotlight-glow
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[min(70%,22rem)] w-[min(70%,22rem)] rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 42%, transparent 70%)",
          mixBlendMode: "soft-light",
        }}
        aria-hidden
      />
      <div
        data-spotlight-rim
        className="pointer-events-none absolute inset-0 z-[15] rounded-[inherit] opacity-0"
        style={{
          padding: 1,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          background:
            "radial-gradient(520px circle at 50% 50%, rgba(255,255,255,0.7), transparent 42%)",
        }}
        aria-hidden
      />
      <div
        ref={veilRef}
        data-spotlight-veil
        className="pointer-events-none absolute inset-0 z-[12] opacity-0"
        aria-hidden
      />

      <ColorDots
        index={index}
        className="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-2.5 py-1.5 shadow-sm backdrop-blur-[2px] sm:hidden"
      />

      <div className="relative z-10 order-1 flex shrink-0 flex-col justify-center px-5 pb-4 pr-16 pt-7 sm:px-8 sm:py-10 sm:pr-8 md:px-10 md:py-12 lg:px-10 lg:py-10">
        {/*
          Fixed stack height so dots never jump. Extra bottom padding keeps
          clear space between body copy and the desktop color dots.
          Mobile dots stay top-right (untouched).
        */}
        <div className="relative w-full max-w-[32ch] sm:h-[18.75rem] lg:h-[19.5rem]">
          <div
            ref={copyRef}
            data-spotlight-copy
            className="flex flex-col gap-3.5 will-change-transform sm:gap-5 sm:pb-10 lg:gap-5 lg:pb-11"
          >
            <p
              ref={labelRef}
              className="h-[1.1rem] text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70"
            >
              {SIGNATURE_THEMES[variant.id].label}
            </p>
            <h3
              ref={titleRef}
              className="h-[3.3em] max-w-[13ch] font-[family-name:var(--font-announce)] text-[clamp(1.65rem,4.5vw+0.5rem,3rem)] font-bold leading-[1.06] tracking-[-0.03em] text-ink"
            >
              {variant.title}
            </h3>
            <p
              ref={bodyRef}
              className="h-[6.2em] max-w-[32ch] text-[15px] leading-[1.55] text-ink-label sm:text-[17px] md:text-[18px]"
            >
              {variant.body}
            </p>
          </div>

          <ColorDots
            index={index}
            className="absolute bottom-0 left-0 hidden sm:flex"
          />
        </div>
      </div>

      <div
        ref={mediaWrapRef}
        className="relative order-2 min-h-0 w-full overflow-hidden sm:min-h-[220px] lg:h-full lg:min-h-0"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label={variant.imageAlt}
          role="img"
        />
      </div>
    </article>
  );
}

export { HeroWearSpotlight, WEAR_VARIANTS };
