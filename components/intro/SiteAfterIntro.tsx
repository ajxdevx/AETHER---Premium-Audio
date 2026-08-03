"use client";

import { useIntro } from "@/components/intro/IntroContext";
import { cn } from "@/lib/utils";

/**
 * Keeps home content mounted (landmarks stay in the DOM) but covered/invisible
 * until the signature intro finishes — prevents hero flash on reload before the
 * dynamically loaded intro mounts.
 */
export function SiteAfterIntro({ children }: { children: React.ReactNode }) {
  const { introDone } = useIntro();

  return (
    <>
      {!introDone ? (
        <div
          className="fixed inset-0 z-[9998] bg-white"
          aria-hidden
        />
      ) : null}
      <div
        key={introDone ? "after-intro" : "during-intro"}
        className={cn(!introDone && "invisible pointer-events-none")}
        aria-hidden={!introDone || undefined}
      >
        {children}
      </div>
    </>
  );
}
