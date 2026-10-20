import { motion } from "framer-motion";

export default function EndingOverlay({
  onReplay,
}: {
  onReplay: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/80 px-5 py-10 backdrop-blur-sm sm:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      <div className="my-auto w-full max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.6 }}
          className="font-display text-2xl leading-tight text-white sm:text-3xl md:text-5xl"
        >
          Every civilization began with imagination.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 1.6 }}
          className="font-display mt-6 text-2xl leading-tight text-glow-gold sm:mt-10 sm:text-3xl md:text-5xl"
        >
          What will humanity build next?
        </motion.p>

        <motion.button
          onClick={onReplay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.6, duration: 1.2 }}
          className="glass mt-10 min-h-11 rounded-full px-6 py-3 text-[9px] uppercase tracking-[0.25em] text-white/80 transition hover:text-white sm:mt-16 sm:px-8 sm:text-[10px] sm:tracking-[0.5em]"
        >
          Wander Again
        </motion.button>
      </div>
    </motion.div>
  );
}