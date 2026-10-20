import { motion } from "framer-motion";

export default function IntroOverlay({
  onBegin,
}: {
  onBegin: () => void;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end px-4 pb-[12vh] sm:pb-[14vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      <motion.button
        onClick={onBegin}
        className="group pointer-events-auto relative max-w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="glass inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white sm:gap-4 sm:px-10 sm:py-4 sm:text-xs sm:tracking-[0.5em]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(255,213,121,0.9)]" />

          <span>Begin Journey</span>

          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(255,213,121,0.9)]" />
        </span>

        <span className="absolute inset-0 -z-10 rounded-full bg-amber-300/10 blur-2xl transition-all duration-500 group-hover:bg-amber-300/25" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="mt-5 text-center text-[9px] uppercase tracking-[0.2em] text-white/40 sm:mt-6 sm:text-[10px] sm:tracking-[0.4em]"
      >
        Tap to enter the museum
      </motion.p>
    </motion.div>
  );
}