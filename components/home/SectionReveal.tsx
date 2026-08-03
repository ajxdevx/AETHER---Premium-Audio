"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const sectionViewport = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -6% 0px",
} as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "whileInView">;

/** Soft rise + fade for section blocks. */
export function SectionReveal({
  children,
  className,
  delay = 0,
  y = 40,
  ...rest
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const { id } = rest as { id?: string };
    return (
      <div className={className} id={id}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={sectionViewport}
      transition={{ duration: 0.9, ease: premiumEase, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

/** Parent for staggered children reveals. */
export function StaggerReveal({
  children,
  className,
  stagger = 0.1,
  delay = 0.05,
}: StaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={sectionViewport}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type ItemProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  id?: string;
};

/** Child item used inside StaggerReveal. */
export function StaggerItem({ children, className, y = 32, id }: ItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.8, ease: premiumEase },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type MountProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** Immediate mount entrance (for navbar, hero, shop header). */
export function MountReveal({
  children,
  className,
  delay = 0,
  y = 24,
}: MountProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, ease: premiumEase, delay }}
    >
      {children}
    </motion.div>
  );
}

type MountStaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  /** When false, children stay hidden until flipped to true (hero gate). */
  play?: boolean;
};

/** Staggered mount entrance for above-the-fold layouts. */
export function MountStagger({
  children,
  className,
  stagger = 0.09,
  delay = 0.05,
  play = true,
}: MountStaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate={play ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
