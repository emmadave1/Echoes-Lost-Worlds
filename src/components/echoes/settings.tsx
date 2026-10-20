import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PortalId } from "./portals.config";

type SettingsCtx = {
  reduceMotion: boolean;
  setReduceMotion: (v: boolean) => void;
  audioOn: boolean;
  setAudioOn: (v: boolean) => void;
  activePortal: PortalId | null;
  setActivePortal: (id: PortalId | null) => void;
};

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({
  children,
  audioOn,
  setAudioOn,
  activePortal,
}: {
  children: ReactNode;
  audioOn: boolean;
  setAudioOn: (v: boolean) => void;
  activePortal: PortalId | null;
}) {
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = window.localStorage.getItem("echoes:reduceMotion");
      if (saved != null) return saved === "1";
    } catch {}
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  const value = useMemo<SettingsCtx>(
    () => ({
      reduceMotion,
      setReduceMotion: (v) => {
        setReduceMotion(v);
        try {
          window.localStorage.setItem("echoes:reduceMotion", v ? "1" : "0");
        } catch {}
      },
      audioOn,
      setAudioOn,
      activePortal,
      setActivePortal: () => {},
    }),
    [reduceMotion, audioOn, setAudioOn, activePortal]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings must be used within SettingsProvider");
  return v;
}
