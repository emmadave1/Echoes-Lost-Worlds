import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.floor(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 600);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => {
          const left = (i * 137.5) % 100;
          const size = 1 + ((i * 13) % 3);
          const duration = 8 + ((i * 7) % 14);
          const delay = -(i * 0.3) % duration;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white/60 animate-drift"
              style={{
                left: `${left}%`,
                bottom: "-10px",
                width: size,
                height: size,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                filter: "blur(0.5px)",
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h1 className="font-display text-glow-gold text-6xl md:text-8xl tracking-[0.4em]">
            ECHOES
          </h1>
          <p className="mt-4 text-xs md:text-sm uppercase tracking-[0.5em] text-white/60">
            The Museum of Lost Civilizations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <div className="h-px w-64 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-transparent via-amber-300 to-transparent transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs tracking-[0.3em] text-white/50">
            {String(progress).padStart(3, "0")}%
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
