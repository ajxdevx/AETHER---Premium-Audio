"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type IntroContextValue = {
  introDone: boolean;
  /** True after we've read path (avoids wrong first paint). */
  introGateReady: boolean;
  completeIntro: () => void;
};

type IntroGate = {
  ready: boolean;
  skipIntro: boolean;
};

const IntroContext = createContext<IntroContextValue | null>(null);

function isHomePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

const SERVER_GATE: IntroGate = { ready: false, skipIntro: false };

let cachedClientGate: IntroGate | null = null;

function subscribeNoop() {
  return () => {};
}

function getIntroGate(): IntroGate {
  if (cachedClientGate) return cachedClientGate;
  cachedClientGate = {
    ready: true,
    skipIntro:
      navigator.webdriver === true ||
      !isHomePath(window.location.pathname),
  };
  return cachedClientGate;
}

function getServerIntroGate(): IntroGate {
  return SERVER_GATE;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const gate = useSyncExternalStore(
    subscribeNoop,
    getIntroGate,
    getServerIntroGate
  );
  const [manualDone, setManualDone] = useState(false);

  const completeIntro = useCallback(() => {
    setManualDone(true);
  }, []);

  const introDone = gate.skipIntro || manualDone;

  const value = useMemo(
    () => ({
      introDone,
      introGateReady: gate.ready,
      completeIntro,
    }),
    [introDone, gate.ready, completeIntro]
  );

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro must be used within IntroProvider");
  }
  return ctx;
}
