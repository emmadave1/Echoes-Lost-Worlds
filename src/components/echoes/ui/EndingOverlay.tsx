import { motion } from "framer-motion";

export default function EndingOverlay({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      <div className="max-w-2xl px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.6 }}
          className="font-display text-3xl md:text-5xl leading-tight text-white"
        >
          Every civilization began with imagination.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 1.6 }}
          className="font-display mt-10 text-3xl md:text-5xl leading-tight text-glow-gold"
        >
          What will humanity build next?
        </motion.p>
        <motion.button
          onClick={onReplay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.6, duration: 1.2 }}
          className="glass mt-16 rounded-full px-8 py-3 text-[10px] uppercase tracking-[0.5em] text-white/80 transition hover:text-white"
        >
          Wander Again
        </motion.button>
      </div>
    </motion.div>
  );
}
