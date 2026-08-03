"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ASSETS } from "@/constants/assets";
import { SIGNATURE_THEMES, type SignatureThemeId } from "@/constants/brand";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSpotlightLiftHover } from "@/hooks/useSpotlightLiftHover";
import { useKitCardSync } from "@/components/home/KitCardSync";
import { loadGsap } from "@/lib/gsapClient";
import { cn } from "@/lib/utils";

export type KitProductKind = "case" | "cable" | "stand" | "accessories";

export type KitSpotlightVariant = {
  id: SignatureThemeId;
  kind: KitProductKind;
  image: string;
  imageAlt: string;
  bg: string;
};

type KitSpotlightCardProps = {
  title: string;
  body: string;
  variants: readonly KitSpotlightVariant[];
  /** Stable id so sibling kit cards can avoid showing the same product. */
  cardId: string;
  startIndex?: number;
  cycleOffsetMs?: number;
  cycleMs?: number;
  className?: string;
  reverse?: boolean;
};

const CYCLE_MS = 3600;
const REVEAL_MS = 1.4;
/** Iris origin biased toward the product media (right / upper on mobile). */
const IRIS_AT = "72% 42%";
const IRIS_HIDDEN = `circle(0% at ${IRIS_AT})`;
const IRIS_FULL = `circle(165% at ${IRIS_AT})`;

function ColorKit(
  id: SignatureThemeId,
  kind: KitProductKind,
  image: string,
  imageAlt: string
): KitSpotlightVariant {
  return {
    id,
    kind,
    image,
    imageAlt,
    bg: SIGNATURE_THEMES[id].soft,
  };
}

function FaceInner({
  title,
  body,
  image,
  imageAlt,
  kind,
  reverse,
  priority = false,
  interactive = false,
  showCopy = true,
}: {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  kind?: KitProductKind;
  reverse?: boolean;
  priority?: boolean;
  interactive?: boolean;
  /** Overlay faces hide copy so title/body never double during iris. */
  showCopy?: boolean;
}) {
  const isStand = kind === "stand";

  const copy = (
    <div
      data-spotlight-copy={interactive || undefined}
      aria-hidden={!showCopy || undefined}
      className={cn(
        "relative z-20 flex flex-col justify-center gap-3 px-5 py-7 sm:px-7 sm:py-8 lg:gap-3 lg:px-8 lg:py-7",
        reverse
          ? "order-2 max-lg:order-2 lg:order-1"
          : "order-2 max-lg:order-2 lg:order-1",
        !showCopy && "invisible"
      )}
    >
      <h3 className="max-w-[11ch] font-[family-name:var(--font-announce)] text-[clamp(1.4rem,3.5vw+0.6rem,2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
        {title}
      </h3>
      <p className="max-w-[28ch] text-[14px] leading-[1.55] text-ink-label sm:text-[15px] md:text-[16px]">
        {body}
      </p>
    </div>
  );

  const media = (
    <div
      className={cn(
        "relative overflow-hidden",
        reverse
          ? "order-1 min-h-[170px] w-full shrink-0 sm:min-h-[180px] max-lg:order-1 max-lg:min-h-[220px] lg:order-2 lg:min-h-[140px]"
          : "order-1 min-h-[150px] sm:min-h-[160px] max-lg:order-1 max-lg:min-h-[220px] lg:order-2 lg:min-h-[140px]"
      )}
    >
      <div
        data-spotlight-media={interactive || undefined}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            className={cn(
              "origin-center object-contain object-center",
              // Stand shots ~10% smaller on mobile only; desktop unchanged.
              isStand
                ? reverse
                  ? "scale-[1.08] sm:scale-[1.12] max-lg:scale-[1.22] lg:scale-[1.15]"
                  : "scale-[1.03] sm:scale-[1.08] max-lg:scale-[1.22] lg:scale-[1.15]"
                : reverse
                  ? "scale-[1.2] sm:scale-[1.25] max-lg:scale-[1.35] lg:scale-[1.15]"
                  : "scale-[1.15] sm:scale-[1.2] max-lg:scale-[1.35] lg:scale-[1.15]"
            )}
            sizes="(max-width: 1024px) 40vw, 20vw"
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {copy}
      {media}
    </>
  );
}

export function KitSpotlightCard({
  title,
  body,
  variants,
  cardId,
  startIndex = 0,
  cycleOffsetMs = 0,
  cycleMs = CYCLE_MS,
  className,
  reverse = false,
}: KitSpotlightCardProps) {
  const reduceMotion = useReducedMotion();
  const sync = useKitCardSync();
  const cardRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const indexRef = useRef(0);

  const initialIndex =
    variants.length > 0
      ? ((startIndex % variants.length) + variants.length) % variants.length
      : 0;

  const [index, setIndex] = useState(initialIndex);
  const [overlay, setOverlay] = useState<KitSpotlightVariant | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const current = variants[index] ?? variants[0];

  useSpotlightLiftHover(cardRef);

  useEffect(() => {
    if (current) sync?.report(cardId, current.kind);
  }, [cardId, current, sync]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    let cancelled = false;
    void loadGsap().then((gsap) => {
      if (cancelled || !overlay.isConnected) return;
      gsap.set(overlay, {
        autoAlpha: 0,
        clipPath: IRIS_HIDDEN,
        scale: 1.05,
        force3D: true,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const pickNextIndex = useCallback(() => {
    const cur = variants[indexRef.current];
    if (!cur || variants.length < 2) return 0;

    const blockedKinds = new Set(sync?.getExcludedKinds(cardId) ?? []);
    blockedKinds.add(cur.kind);

    const indexed = variants.map((item, i) => ({ item, i }));

    // Never repeat this card’s product type, and never match the sibling card.
    const differentProduct = indexed.filter(
      ({ item }) => !blockedKinds.has(item.kind)
    );
    const differentProductAndColor = differentProduct.filter(
      ({ item }) => item.id !== cur.id
    );

    const pool =
      differentProductAndColor.length > 0
        ? differentProductAndColor
        : differentProduct.length > 0
          ? differentProduct
          : indexed.filter(({ item }) => item.kind !== cur.kind);

    const choices = pool.length > 0 ? pool : indexed;
    return choices[Math.floor(Math.random() * choices.length)]!.i;
  }, [cardId, sync, variants]);

  const morphTo = useCallback(
    (nextIndex: number) => {
      if (busyRef.current || nextIndex === indexRef.current) return;
      const next = variants[nextIndex];
      const el = overlayRef.current;
      if (!next || !el) return;

      if (reduceMotion) {
        setIndex(nextIndex);
        setOverlay(null);
        return;
      }

      busyRef.current = true;
      setOverlay(next);

      const run = async () => {
        const gsap = await loadGsap();
        if (!el.isConnected) {
          busyRef.current = false;
          return;
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            gsap.killTweensOf([el, cardRef.current]);
            gsap.set(el, {
              autoAlpha: 1,
              clipPath: IRIS_HIDDEN,
              scale: 1.06,
              transformOrigin: IRIS_AT,
              force3D: true,
            });
            const tl = gsap.timeline({
              defaults: { duration: REVEAL_MS, ease: "expo.inOut", force3D: true },
              onComplete: () => {
                // Commit base layer first — hiding the overlay before React
                // paints the new image flashes the previous slide for a frame.
                flushSync(() => {
                  setIndex(nextIndex);
                });
                gsap.set(el, {
                  autoAlpha: 0,
                  clipPath: IRIS_HIDDEN,
                  scale: 1.05,
                });
                setOverlay(null);
                busyRef.current = false;
              },
            });
            tl.to(el, { clipPath: IRIS_FULL, scale: 1 }, 0);
            if (cardRef.current) {
              tl.to(cardRef.current, { backgroundColor: next.bg }, 0);
            }
          });
        });
      };

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        void run();
      };
      const pre = new window.Image();
      pre.decoding = "async";
      pre.onload = go;
      pre.onerror = go;
      pre.src = next.image;
      if (pre.complete) go();
    },
    [reduceMotion, variants]
  );

  useEffect(() => {
    if (reduceMotion || variants.length < 2) return;
    let intervalId = 0;
    const tick = () => {
      if (busyRef.current) return;
      morphTo(pickNextIndex());
    };
    const firstId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, cycleMs);
    }, cycleOffsetMs + 900);
    return () => {
      window.clearTimeout(firstId);
      window.clearInterval(intervalId);
    };
  }, [
    cycleMs,
    cycleOffsetMs,
    morphTo,
    pickNextIndex,
    reduceMotion,
    variants.length,
  ]);

  if (!current) return null;

  const gridClass = reverse
    ? "grid grid-cols-1 max-lg:h-auto lg:grid lg:grid-cols-2"
    : "grid grid-cols-1 max-lg:h-auto lg:grid-cols-2";

  return (
    <article
      ref={cardRef}
      className={cn(
        "relative isolate cursor-pointer overflow-hidden rounded-[22px] will-change-transform sm:rounded-[28px]",
        gridClass,
        className
      )}
      style={{ backgroundColor: current.bg }}
      aria-label={title}
    >
      <div
        data-spotlight-wash
        className="pointer-events-none absolute inset-0 z-[12] opacity-0"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.35) 0%, transparent 45%, rgba(255,255,255,0.12) 100%)",
        }}
        aria-hidden
      />

      <FaceInner
        title={title}
        body={body}
        image={current.image}
        imageAlt={current.imageAlt}
        kind={current.kind}
        reverse={reverse}
        priority
        interactive
      />

      <div
        ref={overlayRef}
        className={cn(
          "pointer-events-none absolute inset-0 z-[5]",
          reverse
            ? "grid grid-cols-1 lg:grid-cols-2"
            : "grid grid-cols-1 lg:grid-cols-2"
        )}
        style={{ backgroundColor: overlay?.bg ?? current.bg }}
        aria-hidden
      >
        <FaceInner
          title={title}
          body={body}
          image={overlay?.image ?? current.image}
          imageAlt=""
          kind={overlay?.kind ?? current.kind}
          reverse={reverse}
          showCopy={false}
        />
      </div>
    </article>
  );
}

const KIT = ASSETS.marketing.kit;
const COLORS: SignatureThemeId[] = ["green", "pink", "blue", "black"];

const KIT_TYPES = [
  {
    kind: "case" as const,
    images: KIT.cases,
    alt: (label: string) => `${label} smart case`,
  },
  {
    kind: "cable" as const,
    images: KIT.cables,
    alt: (label: string) => `${label} charging cable`,
  },
  {
    kind: "stand" as const,
    images: KIT.stands,
    alt: (label: string) => `${label} pods on stand`,
  },
  {
    kind: "accessories" as const,
    images: KIT.accessories,
    alt: (label: string) => `${label} accessory kit`,
  },
] as const;

export const KIT_SPOTLIGHT_VARIANTS: KitSpotlightVariant[] = COLORS.flatMap(
  (id) =>
    KIT_TYPES.map((type) =>
      ColorKit(
        id,
        type.kind,
        type.images[id],
        type.alt(SIGNATURE_THEMES[id].label)
      )
    )
);
