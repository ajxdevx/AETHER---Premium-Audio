"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/constants/brand";
import { LOGO_GLYPHS, LOGO_WORD } from "@/constants/logoGlyphs";
import { useIntro } from "@/components/intro/IntroContext";
import { preloadHeroAssets } from "@/lib/preloadHeroAssets";

const MATCHA = "var(--brand-accent)";
const DOT_STAGGER = 0.016;
const LETTER_GAP = 0.18;

function letterDots(letter: string) {
  const grid = LOGO_GLYPHS[letter];
  const dots: { key: string; on: boolean; order: number }[] = [];
  let order = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const on = grid[r][c] === 1;
      dots.push({
        key: `${r}-${c}`,
        on,
        order: on ? order++ : -1,
      });
    }
  }
  return { dots, litCount: order };
}

const timed = (() => {
  let t = 0.04;
  return LOGO_WORD.split("").map((letter) => {
    const { dots, litCount } = letterDots(letter);
    const start = t;
    t += litCount * DOT_STAGGER + LETTER_GAP;
    return { letter, start, dots };
  });
})();

const lastLetter = timed[timed.length - 1];
const lastDotOrders = lastLetter.dots.filter((d) => d.on).map((d) => d.order);
const lastOrder = lastDotOrders[lastDotOrders.length - 1] ?? 0;
const INTRO_MS = Math.ceil(
  (lastLetter.start + lastOrder * DOT_STAGGER + 0.22) * 1000,
);

export function SignatureIntro() {
  const { introDone, introGateReady, completeIntro } = useIntro();
  const shouldPlay = introGateReady && !introDone;
  const [dismissed, setDismissed] = useState(false);
  const visible = shouldPlay && !dismissed;

  const finish = useCallback(() => {
    setDismissed(true);
    completeIntro();
  }, [completeIntro]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    preloadHeroAssets();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(finish, INTRO_MS);
    return () => window.clearTimeout(t);
  }, [visible, finish]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={`${BRAND.name} introduction`}
      aria-modal="true"
      className="fixed inset-0 z-[9999] grid h-[100dvh] w-full max-w-[100vw] place-items-center overflow-hidden bg-white [padding:env(safe-area-inset-top)_env(safe-area-inset-right)_env(safe-area-inset-bottom)_env(safe-area-inset-left)]"
    >
      <div
        className="box-border flex w-full max-w-[min(100%,24rem)] items-center justify-center gap-[clamp(0.35rem,2.2vw,1.5rem)] px-4 sm:max-w-none sm:gap-4 sm:px-6 md:gap-6"
        style={{ color: MATCHA }}
        role="img"
        aria-label={BRAND.name}
      >
        {timed.map(({ letter, start, dots }) => (
          <span
            key={`${letter}-${start}`}
            className="inline-grid shrink grid-cols-5 gap-[clamp(1.5px,0.45vw,8px)]"
          >
            {dots.map(({ key, on, order }) =>
              on ? (
                <motion.span
                  key={key}
                  className="size-[clamp(5px,1.7vw,14px)] rounded-full bg-current"
                  initial={{ opacity: 0, scale: 0.25 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: start + order * DOT_STAGGER,
                    ease: [0.45, 0, 0.15, 1],
                  }}
                />
              ) : (
                <span key={key} className="size-[clamp(5px,1.7vw,14px)]" />
              ),
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
