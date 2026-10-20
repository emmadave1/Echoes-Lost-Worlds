import { useEffect, useRef, useState } from "react";
import MobileWorldExplorer from "./ui/MobileWorldExplorer";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
import Scene3D from "./Scene3D";
import UIOverlay from "./ui/UIOverlay";
import IntroOverlay from "./ui/IntroOverlay";
import PortalHUD from "./ui/PortalHUD";
import EndingOverlay from "./ui/EndingOverlay";
import AudioManager from "./AudioManager";
import { SettingsProvider } from "./settings";
import { PORTALS, type PortalId } from "./portals.config";

export type Stage = "loading" | "intro" | "museum" | "scene" | "ending";

export default function EchoesApp() {
  const [stage, setStage] = useState<Stage>("loading");
  const [activePortal, setActivePortal] = useState<PortalId | null>(null);
  const [visited, setVisited] = useState<Set<PortalId>>(new Set());
  const [hovered, setHovered] = useState<PortalId | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (visited.size === PORTALS.length && stage === "museum") {
      const t = setTimeout(() => setStage("ending"), 1200);
      return () => clearTimeout(t);
    }
  }, [visited, stage]);

  // Keyboard navigation: arrows cycle focused portal, Enter/Space enters it.
  useEffect(() => {
    if (stage !== "museum") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "Tab") {
        e.preventDefault();
        setHovered((h) => {
          const i = h ? PORTALS.findIndex((p) => p.id === h) : -1;
          return PORTALS[(i + 1 + PORTALS.length) % PORTALS.length].id;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setHovered((h) => {
          const i = h ? PORTALS.findIndex((p) => p.id === h) : 0;
          return PORTALS[(i - 1 + PORTALS.length) % PORTALS.length].id;
        });
      } else if ((e.key === "Enter" || e.key === " ") && hovered) {
        e.preventDefault();
        enterPortal(hovered);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, hovered]);

  const enterPortal = (id: PortalId) => {
    setActivePortal(id);
    setStage("scene");
    setVisited((v) => new Set(v).add(id));
  };

  const exitPortal = () => {
    setActivePortal(null);
    setStage("museum");
  };

  const replay = () => {
    // Seamless reset: clear worlds, return to museum with orb reopening.
    setActivePortal(null);
    setVisited(new Set());
    setHovered(null);
    // brief flicker back through intro camera then to museum for cinematic re-entry
    setStage("intro");
    window.setTimeout(() => setStage("museum"), 900);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) rootRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <SettingsProvider audioOn={audioOn} setAudioOn={setAudioOn} activePortal={activePortal}>
      <div ref={rootRef} className="fixed inset-0 bg-black text-foreground select-none">
        {stage !== "loading" && (
          <Scene3D
            stage={stage}
            activePortal={activePortal}
            hovered={hovered}
            onHoverPortal={setHovered}
            onEnterPortal={enterPortal}
            onBegin={() => setStage("museum")}
          />
        )}

        {stage !== "loading" && (
          <div className="pointer-events-none absolute inset-0 z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
              }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {stage === "loading" && <LoadingScreen key="loading" onDone={() => setStage("intro")} />}
          {stage === "intro" && <IntroOverlay key="intro" onBegin={() => setStage("museum")} />}
          {stage === "scene" && activePortal && (
            <PortalHUD key={`hud-${activePortal}`} portalId={activePortal} onExit={exitPortal} />
          )}
          {stage === "ending" && <EndingOverlay key="ending" onReplay={replay} />}
        </AnimatePresence>

        {stage !== "loading" && (
          <>
            {isMobile && stage === "museum" ? (
              <MobileWorldExplorer onEnterPortal={enterPortal} visited={visited} />
            ) : (
              <UIOverlay
                stage={stage}
                visitedCount={visited.size}
                total={PORTALS.length}
                onFullscreen={toggleFullscreen}
              />
            )}
          </>
        )}

        <AudioManager audioOn={audioOn} activePortal={activePortal} stage={stage} />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap"
        />
      </div>
    </SettingsProvider>
  );
}
