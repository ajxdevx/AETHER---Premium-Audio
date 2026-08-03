import { lenisScrollTo, lenisStopInertia, getNavScrollOffset } from "@/lib/smoothScroll";

export function isPlaceholderHref(href: string) {
  const trimmed = href.trim();
  return trimmed === "#" || trimmed === "";
}

function withInstantScroll(action: () => void) {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  action();
  root.style.scrollBehavior = previous;
}

export function enableManualScrollRestoration() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}

export function forceScrollToTop() {
  if (lenisScrollTo(0, "auto")) {
    return;
  }

  withInstantScroll(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

export function snapToTopWhenReady(pathname: string, maxAttempts = 40) {
  const generation = scrollGeneration;
  let attempts = 0;

  const trySnap = () => {
    if (generation !== scrollGeneration) {
      return;
    }

    forceScrollToTop();
    const afterY = window.scrollY;

    if (afterY === 0 || attempts >= maxAttempts) {
      return;
    }

    attempts += 1;
    requestAnimationFrame(trySnap);
  };

  trySnap();
}

const PENDING_HOME_HASH_KEY = "aether:pending-home-hash";

let scrollGeneration = 0;
let pendingSectionTimeout: number | null = null;

export function cancelAllNavScrolls() {
  scrollGeneration += 1;

  if (pendingSectionTimeout !== null) {
    clearTimeout(pendingSectionTimeout);
    pendingSectionTimeout = null;
  }

  if (lenisStopInertia()) {
    return;
  }

  window.scrollTo(window.scrollX, window.scrollY);
}

export function scrollToPageTop(behavior: ScrollBehavior = "smooth") {
  if (lenisScrollTo(0, behavior)) {
    return;
  }

  const scroll = () => window.scrollTo({ top: 0, left: 0, behavior });

  if (behavior === "auto") {
    withInstantScroll(scroll);
    return;
  }

  scroll();
}

function getElementScrollTop(el: HTMLElement) {
  const y = el.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, y - getNavScrollOffset());
}

export function scrollToHash(id: string, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(id);
  if (!el) {
    return false;
  }

  const top = getElementScrollTop(el);

  if (lenisScrollTo(top, behavior)) {
    return true;
  }

  const scroll = () => window.scrollTo({ top, left: 0, behavior });

  if (behavior === "auto") {
    withInstantScroll(scroll);
  } else {
    scroll();
  }

  return true;
}

export function scrollToHashWhenReady(
  id: string,
  behavior: ScrollBehavior = "smooth",
  maxAttempts = 50
) {
  const generation = scrollGeneration;
  let attempts = 0;

  const tryScroll = () => {
    if (generation !== scrollGeneration) {
      return;
    }

    if (scrollToHash(id, behavior)) {
      if (behavior === "smooth") {
        window.setTimeout(() => {
          if (generation !== scrollGeneration) return;
          scrollToHash(id, "auto");
        }, 420);
      }
      return;
    }

    attempts += 1;
    if (attempts < maxAttempts) {
      requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();
}

export function applyNavScroll(href: string) {
  if (isPlaceholderHref(href)) {
    return;
  }

  const url = new URL(href, window.location.origin);
  const hash = url.hash.slice(1);

  if (hash) {
    cancelAllNavScrolls();
    window.history.pushState(null, "", `${url.pathname}${url.hash}`);
    scrollToHashWhenReady(hash, "smooth");
    return;
  }

  cancelAllNavScrolls();
  window.history.pushState(null, "", url.pathname);
  scrollToPageTop();
}

export function handleNavLinkClick(
  href: string,
  event: React.MouseEvent<HTMLAnchorElement>
) {
  if (isPlaceholderHref(href)) {
    event.preventDefault();
    return;
  }

  const url = new URL(href, window.location.origin);

  if (window.location.pathname !== url.pathname) {
    return;
  }

  event.preventDefault();
  applyNavScroll(href);
}

export function isHomeSectionLink(href: string) {
  const url = new URL(href, window.location.origin);
  return url.pathname === "/" && url.hash.length > 1;
}

export function getLocalHashTarget(href: string): string | null {
  const hash = new URL(href, window.location.origin).hash.slice(1);
  if (!hash || typeof document === "undefined") {
    return null;
  }

  return document.getElementById(hash) ? hash : null;
}

export function scrollToHashOnCurrentPage(pathname: string, hash: string) {
  cancelAllNavScrolls();
  window.history.pushState(null, "", `${pathname}#${hash}`);
  scrollToHashWhenReady(hash, "smooth");
}

export function clearPendingHomeHash() {
  sessionStorage.removeItem(PENDING_HOME_HASH_KEY);
}

export function hasPendingHomeHash(): boolean {
  return sessionStorage.getItem(PENDING_HOME_HASH_KEY) != null;
}

export function consumePendingHomeHash(): string | null {
  const pending = sessionStorage.getItem(PENDING_HOME_HASH_KEY);
  if (pending) {
    clearPendingHomeHash();
  }
  return pending;
}

export function navigateToHomeSection(
  router: { push: (href: string, options?: { scroll?: boolean }) => void },
  href: string
) {
  const url = new URL(href, window.location.origin);
  const hash = url.hash.slice(1);

  cancelAllNavScrolls();

  if (hash) {
    sessionStorage.setItem(PENDING_HOME_HASH_KEY, hash);
  } else {
    clearPendingHomeHash();
  }

  router.push("/", { scroll: false });
}

export function navigateToPage(
  router: { push: (href: string, options?: { scroll?: boolean }) => void },
  href: string
) {
  cancelAllNavScrolls();
  clearPendingHomeHash();

  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  router.push(href, { scroll: false });
}

export function scrollToPendingHomeSection() {
  const pending = consumePendingHomeHash();
  if (!pending) {
    return false;
  }

  cancelAllNavScrolls();
  const generation = scrollGeneration;

  scrollToPageTop("auto");
  window.history.replaceState(null, "", `/#${pending}`);

  pendingSectionTimeout = window.setTimeout(() => {
    pendingSectionTimeout = null;
    if (generation !== scrollGeneration) {
      return;
    }
    scrollToHashWhenReady(pending, "smooth");
  }, 300);

  return true;
}
