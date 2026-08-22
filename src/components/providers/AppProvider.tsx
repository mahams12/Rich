"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { AppContext, stubAppValue, useApp } from "./app-context";

export { useApp };
export type { AppContextValue, CheckoutDraft } from "./app-context";

export function AppProvider({ children }: { children: ReactNode }) {
  const [Live, setLive] = useState<ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("./AppProviderLive").then((mod) => {
      if (!cancelled) setLive(() => mod.AppProviderLive);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Live) {
    return <AppContext.Provider value={stubAppValue}>{children}</AppContext.Provider>;
  }

  return <Live>{children}</Live>;
}
