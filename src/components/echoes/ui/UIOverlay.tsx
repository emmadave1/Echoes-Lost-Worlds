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
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-6"
      >
        <div className="pointer-events-auto">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:text-white"
            aria-label="Menu"
          >
            <HiOutlineMenuAlt4 className="h-4 w-4" />
          </button>
        </div>

        <div className="font-display text-sm tracking-[0.6em] text-white/80">ECHOES</div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`glass flex h-10 items-center gap-2 rounded-full px-3 text-[10px] uppercase tracking-[0.35em] transition ${
              reduceMotion ? "text-amber-200" : "text-white/70 hover:text-white"
            }`}
            aria-label="Toggle reduce motion"
            aria-pressed={reduceMotion}
            title="Reduce motion"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                reduceMotion ? "bg-amber-300 shadow-[0_0_10px_rgba(255,213,121,0.9)]" : "bg-white/40"
              }`}
            />
            Calm
          </button>
          <button
            onClick={() => setAudioOn(!audioOn)}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:text-white"
            aria-label="Toggle audio"
            aria-pressed={audioOn}
          >
            {audioOn ? <HiOutlineSpeakerWave className="h-4 w-4" /> : <HiOutlineSpeakerXMark className="h-4 w-4" />}
          </button>
          <button
            onClick={onFullscreen}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:text-white"
            aria-label="Fullscreen"
          >
            <HiOutlineArrowsExpand className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="glass flex items-center gap-3 rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.4em] text-white/70">
          <span>Civilizations</span>
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i < visitedCount ? "bg-amber-300 shadow-[0_0_10px_rgba(255,213,121,0.9)]" : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-white/60">
            {String(visitedCount).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </motion.div>

      {stage === "museum" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.4em] text-white/50"
        >
          <div>Move mouse · Click portal to enter</div>
          <div className="mt-1 text-white/35">
            or <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-white/70">←</kbd>{" "}
            <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-white/70">→</kbd> to focus ·{" "}
            <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-white/70">Enter</kbd> to activate
          </div>
        </motion.div>
      )}

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="pointer-events-auto absolute left-6 top-20 w-72"
        >
          <div className="glass rounded-2xl p-6 text-white/80">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Chapter</p>
            <h3 className="font-display mt-2 text-2xl text-white">
              {stage === "museum" ? "The Museum" : stage === "scene" ? "A Lost World" : stage === "ending" ? "Echoes Return" : "Awakening"}
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              Five civilizations. Five imaginations. Each a portal to a world that never was — and yet, somehow, always was.
            </p>

            <div className="mt-6 h-px w-full bg-white/10" />

            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/60">
                Reduce motion
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`relative h-5 w-9 rounded-full transition ${
                    reduceMotion ? "bg-amber-300/80" : "bg-white/20"
                  }`}
                  aria-pressed={reduceMotion}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                      reduceMotion ? "left-4" : "left-0.5"
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/60">
                Ambience audio
                <button
                  onClick={() => setAudioOn(!audioOn)}
                  className={`relative h-5 w-9 rounded-full transition ${
                    audioOn ? "bg-amber-300/80" : "bg-white/20"
                  }`}
                  aria-pressed={audioOn}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                      audioOn ? "left-4" : "left-0.5"
                    }`}
                  />
                </button>
              </label>
            </div>

            <div className="mt-6 h-px w-full bg-white/10" />
            <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40">Directed by</p>
            <p className="mt-1 text-xs text-white/70">Echoes Studio · 2026</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
