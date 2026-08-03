"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { premiumEase } from "@/components/home/SectionReveal";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className="flex w-full flex-1 flex-col">{children}</div>;
  }

  return (
    <motion.div
      className="flex w-full flex-1 flex-col"
      initial={{ opacity: 0, y: 28, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, ease: premiumEase }}
    >
      {children}
    </motion.div>
  );
}
