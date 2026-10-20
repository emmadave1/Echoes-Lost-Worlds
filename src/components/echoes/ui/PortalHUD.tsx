import { motion } from "framer-motion";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { getPortal, type PortalId } from "../portals.config";

const DESCRIPTIONS: Record<PortalId, string> = {
  atlantis:
    "Beneath a canopy of silver light, the sunken city breathes. Coral remembers what stone forgot.",

  neotokyo:
    "Neon rain falls on chrome and prayer. Every sign is a promise. Every promise, a debt.",

  verdantis:
    "The forest is one long thought. Roots older than language whisper in patient chords.",

  celestia:
    "Where clouds harden into marble, the sky-people built temples to a sun they never named.",

  unknown:
    "Geometry loosens. The rules soften. What remains is the shape of a question.",

  mars:
    "Across the rust-red deserts, an ancient civilization left its silent monuments beneath the shadow of a forgotten sky.",

  earth:
    "The blue world is a cradle of life. Across oceans, forests, and continents, humanity writes its unfolding story.",

  saturn:
    "Beneath golden skies and rings of ancient dust, a world of mystery turns through the quiet vastness of space.",
};

export default function PortalHUD({
  portalId,
  onExit,
}: {
  portalId: PortalId;
  onExit: () => void;
}) {
  const p = getPortal(portalId);

  return (
    <motion.div
      key={portalId}
      className="pointer-events-none absolute inset-0 z-30 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Civilization title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.4, ease: "easeOut" }}
        className="mt-24 px-5 sm:mt-[14vh] sm:px-10 md:px-20"
      >
        <p
          className="text-[9px] uppercase tracking-[0.25em] sm:text-[10px] sm:tracking-[0.6em]"
          style={{
            color: p.glow,
            textShadow: `0 0 24px ${p.glow}`,
          }}
        >
          Civilization · {String(0).padStart(2, "0")}
        </p>

        <h1 className="font-display mt-3 break-words text-4xl leading-tight text-white sm:text-6xl md:text-8xl md:leading-none">
          {p.name}
        </h1>

        <p className="mt-3 max-w-2xl text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/60 sm:mt-4 sm:text-sm sm:tracking-[0.4em]">
          {p.tagline}
        </p>
      </motion.div>

      {/* Civilization description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4 }}
        className="mt-auto mb-28 max-w-md px-5 pr-6 text-xs leading-relaxed text-white/70 sm:mb-32 sm:px-10 sm:text-sm md:px-20"
      >
        {DESCRIPTIONS[portalId]}
      </motion.p>

      {/* Return button */}
      <motion.button
        onClick={onExit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="glass pointer-events-auto absolute bottom-4 right-4 flex min-h-11 items-center gap-2 rounded-full px-4 py-3 text-[9px] uppercase tracking-[0.15em] text-white/80 transition hover:text-white sm:bottom-8 sm:right-8 sm:gap-3 sm:px-5 sm:text-[10px] sm:tracking-[0.4em]"
      >
        <HiOutlineArrowLeft className="h-3.5 w-3.5 shrink-0" />

        <span>Return to Museum</span>
      </motion.button>
    </motion.div>
  );
}