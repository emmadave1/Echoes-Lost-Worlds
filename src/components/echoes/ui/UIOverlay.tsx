import { motion } from "framer-motion";
import { HiOutlineMenuAlt4, HiOutlineArrowsExpand } from "react-icons/hi";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import { useState } from "react";
import type { Stage } from "../EchoesApp";
import { useSettings } from "../settings";

type Props = {
  stage: Stage;
  visitedCount: number;
  total: number;
  onFullscreen: () => void;
};

export default function UIOverlay({ stage, visitedCount, total, onFullscreen }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { audioOn, setAudioOn, reduceMotion, setReduceMotion } = useSettings();

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {/* Top navigation */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3 sm:gap-4 sm:p-6"
      >
        {/* Menu button */}
        <div className="pointer-events-auto shrink-0">
          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:text-white"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <HiOutlineMenuAlt4 className="h-4 w-4" />
          </button>
        </div>

        {/* Brand */}
        <div className="font-display min-w-0 text-center text-xs tracking-[0.3em] text-white/80 sm:text-sm sm:tracking-[0.6em]">
          ECHOES
        </div>

        {/* Settings controls */}
        <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`glass flex h-10 items-center justify-center gap-2 rounded-full px-2.5 text-[9px] uppercase tracking-[0.15em] transition sm:px-3 sm:text-[10px] sm:tracking-[0.35em] ${
              reduceMotion ? "text-amber-200" : "text-white/70 hover:text-white"
            }`}
            aria-label="Toggle reduce motion"
            aria-pressed={reduceMotion}
            title="Reduce motion"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                reduceMotion
                  ? "bg-amber-300 shadow-[0_0_10px_rgba(255,213,121,0.9)]"
                  : "bg-white/40"
              }`}
            />

            <span>Calm</span>
          </button>

          <button
            onClick={() => setAudioOn(!audioOn)}
            className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:text-white"
            aria-label="Toggle audio"
            aria-pressed={audioOn}
          >
            {audioOn ? (
              <HiOutlineSpeakerWave className="h-4 w-4" />
            ) : (
              <HiOutlineSpeakerXMark className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={onFullscreen}
            className="glass hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:text-white sm:flex"
            aria-label="Fullscreen"
          >
            <HiOutlineArrowsExpand className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Civilization progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className={`pointer-events-none absolute left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 ${
          stage === "scene" ? "bottom-20 sm:bottom-6" : "bottom-4 sm:bottom-6"
        }`}
      >
        <div className="glass flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-white/70 sm:gap-3 sm:px-5 sm:text-[10px] sm:tracking-[0.4em]">
          <span className="hidden sm:inline">Civilizations</span>

          <div className="flex shrink-0 gap-1">
            {Array.from({ length: total }).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-3 rounded-full transition-all sm:w-6 ${
                  index < visitedCount
                    ? "bg-amber-300 shadow-[0_0_10px_rgba(255,213,121,0.9)]"
                    : "bg-white/15"
                }`}
              />
            ))}
          </div>

          <span className="shrink-0 font-mono text-white/60">
            {String(visitedCount).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </motion.div>

      {/* Museum instructions */}
      {stage === "museum" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="pointer-events-none absolute bottom-16 left-1/2 w-full -translate-x-1/2 px-4 text-center text-[9px] uppercase tracking-[0.2em] text-white/50 sm:bottom-6 sm:left-6 sm:w-auto sm:translate-x-0 sm:px-0 sm:text-left sm:text-[10px] sm:tracking-[0.4em]"
        >
          <div>Tap a portal to explore</div>

          <div className="mt-1 hidden text-white/35 sm:block">
            Move mouse · Click portal to enter
          </div>

          <div className="mt-1 hidden text-white/35 sm:block">
            or{" "}
            <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-white/70">
              ←
            </kbd>{" "}
            <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-white/70">
              →
            </kbd>{" "}
            to focus ·{" "}
            <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-white/70">
              Enter
            </kbd>{" "}
            to activate
          </div>
        </motion.div>
      )}

      {/* Menu panel */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="pointer-events-auto absolute left-3 right-3 top-16 max-h-[calc(100%-5rem)] overflow-y-auto sm:left-6 sm:right-auto sm:top-20 sm:w-72"
        >
          <div className="glass rounded-2xl p-4 text-white/80 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Chapter</p>

            <h3 className="font-display mt-2 text-2xl text-white">
              {stage === "museum"
                ? "The Museum"
                : stage === "scene"
                  ? "A Lost World"
                  : stage === "ending"
                    ? "Echoes Return"
                    : "Awakening"}
            </h3>

            <p className="mt-4 text-xs leading-relaxed text-white/60">
              Discover lost civilizations and imagined worlds, each revealing a different
              possibility of what was, what is, and what could be.
            </p>

            <div className="mt-6 h-px w-full bg-white/10" />

            <div className="mt-4 space-y-4">
              <label className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-[11px] sm:tracking-[0.3em]">
                Reduce motion
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`relative h-6 w-10 shrink-0 rounded-full transition ${
                    reduceMotion ? "bg-amber-300/80" : "bg-white/20"
                  }`}
                  aria-label="Toggle reduced motion"
                  aria-pressed={reduceMotion}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      reduceMotion ? "left-5" : "left-1"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-[11px] sm:tracking-[0.3em]">
                Ambience audio
                <button
                  onClick={() => setAudioOn(!audioOn)}
                  className={`relative h-6 w-10 shrink-0 rounded-full transition ${
                    audioOn ? "bg-amber-300/80" : "bg-white/20"
                  }`}
                  aria-label="Toggle ambience audio"
                  aria-pressed={audioOn}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      audioOn ? "left-5" : "left-1"
                    }`}
                  />
                </button>
              </label>
            </div>

            <div className="mt-6 h-px w-full bg-white/10" />

            <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40">Built by</p>

            <p className="mt-1 text-xs text-white/70">Alamzy · 2026</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
