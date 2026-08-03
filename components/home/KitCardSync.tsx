"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type { KitProductKind } from "@/components/home/KitSpotlightCard";

type KitCardSyncValue = {
  /** Register what this card is currently showing. */
  report: (cardId: string, kind: KitProductKind) => void;
  /** Product kinds currently shown on every other kit card. */
  getExcludedKinds: (cardId: string) => KitProductKind[];
};

const KitCardSyncContext = createContext<KitCardSyncValue | null>(null);

export function KitCardSyncProvider({ children }: { children: ReactNode }) {
  const kindsRef = useRef<Map<string, KitProductKind>>(new Map());

  const report = useCallback((cardId: string, kind: KitProductKind) => {
    kindsRef.current.set(cardId, kind);
  }, []);

  const getExcludedKinds = useCallback((cardId: string) => {
    const excluded: KitProductKind[] = [];
    for (const [id, kind] of kindsRef.current) {
      if (id !== cardId) excluded.push(kind);
    }
    return excluded;
  }, []);

  const value = useMemo(
    () => ({ report, getExcludedKinds }),
    [report, getExcludedKinds]
  );

  return (
    <KitCardSyncContext.Provider value={value}>
      {children}
    </KitCardSyncContext.Provider>
  );
}

export function useKitCardSync() {
  return useContext(KitCardSyncContext);
}
