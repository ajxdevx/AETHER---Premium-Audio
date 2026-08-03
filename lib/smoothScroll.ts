import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let pageScrollLockCount = 0;

export function isPageScrollLocked() {
  return pageScrollLockCount > 0;
}

function applyNativeScrollLock(locked: boolean) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const body = document.body;
  if (locked) {
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    html.classList.add("page-scroll-locked");
  } else {
    html.style.overflow = "";
    body.style.overflow = "";
    html.style.overscrollBehavior = "";
    body.style.overscrollBehavior = "";
    html.classList.remove("page-scroll-locked");
  }
}

/** Hard-lock page scroll (native + Lenis). Supports nested locks. */
export function lockPageScroll() {
  pageScrollLockCount += 1;
  if (pageScrollLockCount === 1) {
    applyNativeScrollLock(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }
  lenisInstance?.scrollTo(0, { immediate: true });
  lenisInstance?.stop();
}

export function unlockPageScroll() {
  pageScrollLockCount = Math.max(0, pageScrollLockCount - 1);
  if (pageScrollLockCount === 0) {
    applyNativeScrollLock(false);
    lenisInstance?.start();
  }
}

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
  // Lenis boots after mount — honor an already-active skeleton lock.
  if (instance && isPageScrollLocked()) {
    instance.scrollTo(0, { immediate: true });
    instance.stop();
  }
}

export function getLenis() {
  return lenisInstance;
}

/**
 * How many px to leave above a hash target.
 * Header is not sticky, so use a small inset — not the full chrome height —
 * so Experience / Reviews land on the first card accurately (esp. mobile).
 */
export function getNavScrollOffset() {
  if (typeof window === "undefined") {
    return 16;
  }

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  return isMobile ? 12 : 20;
}

/** Lenis element offset (negative = leave space above target). */
export function getScrollPaddingOffset() {
  return -getNavScrollOffset();
}

export function lenisScrollTo(
  target: number | string | HTMLElement,
  behavior: ScrollBehavior = "smooth"
) {
  if (isPageScrollLocked()) {
    return false;
  }

  const lenis = lenisInstance;
  if (!lenis) {
    return false;
  }

  const isElement =
    typeof target !== "number" &&
    (typeof target === "string" || target instanceof HTMLElement);

  lenis.scrollTo(target, {
    immediate: behavior === "auto",
    offset: isElement ? getScrollPaddingOffset() : 0,
    programmatic: true,
  });

  return true;
}

export function lenisStopInertia() {
  const lenis = lenisInstance;
  if (!lenis) {
    return false;
  }

  lenis.scrollTo(lenis.scroll, { immediate: true });
  return true;
}
