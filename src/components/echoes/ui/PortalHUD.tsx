import { motion } from "framer-motion";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { getPortal, type PortalId } from "../portals.config";

const DESCRIPTIONS: Record<PortalId, string> = {
  atlantis: "Beneath a canopy of silver light, the sunken city breathes. Coral remembers what stone forgot.",
  neotokyo: "Neon rain falls on chrome and prayer. Every sign is a promise. Every promise, a debt.",
  verdantis: "The forest is one long thought. Roots older than language whisper in patient chords.",
  celestia: "Where clouds harden into marble, the sky-people built temples to a sun they never named.",
  unknown: "Geometry loosens. The rules soften. What remains is the shape of a question.",
};

export default function PortalHUD({ portalId, onExit }: { portalId: PortalId; onExit: () => void }) {
  const p = getPortal(portalId);
  return (
    <motion.div
      key={portalId}
      className="pointer-events-none absolute inset-0 z-30 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Title reveal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.4, ease: "easeOut" }}
        className="mt-[14vh] px-10 md:px-20"
      >
        <p
          className="text-[10px] uppercase tracking-[0.6em]"
          style={{ color: p.glow, textShadow: `0 0 24px ${p.glow}` }}
        >
          Civilization · {String(0).padStart(2, "0")}
        </p>
        <h1 className="font-display mt-3 text-6xl md:text-8xl text-white leading-none">
          {p.name}
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.4em] text-white/60">{p.tagline}</p>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4 }}
        className="mt-auto mb-32 max-w-md px-10 md:px-20 text-sm leading-relaxed text-white/70"
      >
        {DESCRIPTIONS[portalId]}
      </motion.p>

      {/* Return button */}
      <motion.button
        onClick={onExit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="glass pointer-events-auto absolute bottom-8 right-8 flex items-center gap-3 rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.4em] text-white/80 transition hover:text-white"
      >
        <HiOutlineArrowLeft className="h-3.5 w-3.5" />
        Return to Museum
      </motion.button>
    </motion.div>
  );
}
