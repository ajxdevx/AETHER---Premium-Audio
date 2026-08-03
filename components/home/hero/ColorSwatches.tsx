"use client";

import { motion } from "framer-motion";
import { SIGNATURE_THEMES, type SignatureThemeId } from "@/constants/brand";
import { cn } from "@/lib/utils";
import {
  HERO_DISPLAY_COLORS,
  colorPanelVariants,
  swatchListVariants,
  swatchItemVariants,
} from "./constants";

export function ColorSwatches({
  themeId,
  themeLabel,
  setThemeId,
  compact,
  animateEntrance,
  reduceMotion,
  play,
}: {
  themeId: SignatureThemeId;
  themeLabel: string;
  setThemeId: (id: SignatureThemeId) => void;
  compact?: boolean;
  animateEntrance?: boolean;
  reduceMotion?: boolean;
  play?: boolean;
}) {
  const shouldAnimate = Boolean(animateEntrance && !reduceMotion);

  const panelClass = cn(
    "bg-white shadow-[0_16px_36px_-24px_rgba(40,35,20,0.3)]",
    compact ? "rounded-full px-3 py-2" : "rounded-[1.35rem] p-3"
  );

  const rowClass = cn(
    "grid grid-cols-4",
    compact ? "mt-1.5 gap-2.5" : "mt-2.5 gap-2"
  );

  const swatches = HERO_DISPLAY_COLORS.map(({ id, name, hex }) => {
    const selected = themeId === id;
    const ringColor = SIGNATURE_THEMES[id].accent;
    const swatchClass = cn(
      "mx-auto aspect-square w-full cursor-pointer rounded-full shadow-[0_1px_2px_rgba(26,26,26,0.12)] transition-[transform,box-shadow] duration-200",
      compact ? "max-w-[1.4rem]" : "max-w-[1.85rem]",
      selected
        ? "scale-105 ring-2 ring-offset-2 ring-offset-white"
        : "hover:scale-105"
    );
    const swatchStyle = {
      backgroundColor: hex,
      ...(selected ? { ["--tw-ring-color" as string]: ringColor } : {}),
    };

    if (shouldAnimate) {
      return (
        <motion.button
          key={id}
          type="button"
          role="radio"
          title={name}
          aria-label={`Switch theme to ${name}`}
          aria-checked={selected}
          onClick={() => setThemeId(id)}
          variants={swatchItemVariants}
          className={swatchClass}
          style={swatchStyle}
        />
      );
    }

    return (
      <button
        key={id}
        type="button"
        role="radio"
        title={name}
        aria-label={`Switch theme to ${name}`}
        aria-checked={selected}
        onClick={() => setThemeId(id)}
        className={swatchClass}
        style={swatchStyle}
      />
    );
  });

  const content = (
    <>
      <p
        className={cn(
          "text-center font-bold uppercase tracking-[0.14em] text-brand",
          compact ? "text-[9px]" : "text-[10px]"
        )}
      >
        Choose color
      </p>
      {shouldAnimate ? (
        <motion.div
          className={rowClass}
          role="radiogroup"
          aria-label="Choose signature color theme"
          variants={swatchListVariants}
        >
          {swatches}
        </motion.div>
      ) : (
        <div
          className={rowClass}
          role="radiogroup"
          aria-label="Choose signature color theme"
        >
          {swatches}
        </div>
      )}
      <p
        className={cn(
          "text-center font-semibold text-brand",
          compact ? "mt-1 text-[10px]" : "mt-2 text-[11px]"
        )}
      >
        {themeLabel}
      </p>
    </>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className={panelClass}
        initial="hidden"
        animate={play ? "show" : "hidden"}
        variants={colorPanelVariants}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={panelClass}>{content}</div>;
}
