import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PORTALS, type PortalId } from "../portals.config";

type Props = {
onEnterPortal: (id: PortalId) => void;
visited: Set<PortalId>;
};

const SWIPE_THRESHOLD = 50;

export default function MobileWorldExplorer({
onEnterPortal,
visited,
}: Props) {
const [currentIndex, setCurrentIndex] = useState(0);
const touchStartX = useRef<number | null>(null);

const portal = PORTALS[currentIndex];
const total = PORTALS.length;

const previousWorld = () => {
setCurrentIndex((index) => (index - 1 + total) % total);
};

const nextWorld = () => {
setCurrentIndex((index) => (index + 1) % total);
};

const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
touchStartX.current = event.touches[0].clientX;
};

const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
if (touchStartX.current === null) return;

const distance =
  event.changedTouches[0].clientX - touchStartX.current;

if (distance < -SWIPE_THRESHOLD) {
  nextWorld();
} else if (distance > SWIPE_THRESHOLD) {
  previousWorld();
}

touchStartX.current = null;

};

const hasVisited = visited.has(portal.id);

return ( <section
   className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#04050a] px-5 pb-8 pt-24 text-white sm:px-8"
   onTouchStart={handleTouchStart}
   onTouchEnd={handleTouchEnd}
   aria-label="Explore the lost worlds"
 >
{/* Atmospheric background */}
<div
className="pointer-events-none absolute inset-0"
style={{
background: `radial-gradient(ellipse at 50% 35%, ${portal.color}25 0%, transparent 65%)`,
}}
/>

  {/* World counter */}
  <div className="relative z-10 flex items-center justify-between">
    <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
      World Explorer
    </p>

    <p className="text-xs tracking-[0.2em] text-white/70">
      {String(currentIndex + 1).padStart(2, "0")} /{" "}
      {String(total).padStart(2, "0")}
    </p>
  </div>

  {/* Selected world */}
  <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
    <AnimatePresence mode="wait">
      <motion.div
        key={portal.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.3 }}
        className="flex w-full max-w-md flex-col items-center"
      >
        {/* Glowing world emblem */}
        <div
          className="mb-8 flex h-32 w-32 items-center justify-center rounded-full border sm:h-40 sm:w-40"
          style={{
            borderColor: `${portal.glow}80`,
            background: `radial-gradient(circle, ${portal.color}35, transparent 70%)`,
            boxShadow: `0 0 55px ${portal.color}25, inset 0 0 30px ${portal.color}15`,
          }}
        >
          <div
            className="h-16 w-16 rounded-full sm:h-20 sm:w-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, white, ${portal.color} 45%, transparent 80%)`,
              boxShadow: `0 0 35px ${portal.glow}90`,
            }}
          />
        </div>

        <p
          className="mb-3 text-[10px] uppercase tracking-[0.4em]"
          style={{ color: portal.glow }}
        >
          {portal.tagline}
        </p>

        <h1 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
          {portal.name}
        </h1>

        <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
          A lost world waits beyond the portal. Step through and discover
          what remains of its forgotten story.
        </p>

        <button
          type="button"
          onClick={() => onEnterPortal(portal.id)}
          className="mt-9 rounded-full border px-8 py-4 text-xs uppercase tracking-[0.25em] transition-colors active:scale-95"
          style={{
            borderColor: `${portal.glow}90`,
            backgroundColor: `${portal.color}18`,
          }}
        >
          {hasVisited ? "Revisit World" : "Explore World"}
          <span className="ml-3" aria-hidden="true">
            →
          </span>
        </button>

        {hasVisited && (
          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
            World discovered
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  </div>

  {/* Navigation */}
  <div className="relative z-10 mx-auto w-full max-w-md">
    <div className="mb-6 flex items-center justify-center gap-2">
      {PORTALS.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setCurrentIndex(index)}
          aria-label={`View ${item.name}`}
          aria-current={index === currentIndex ? "step" : undefined}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: index === currentIndex ? 28 : 8,
            backgroundColor:
              index === currentIndex ? item.glow : "#ffffff35",
          }}
        />
      ))}
    </div>

    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={previousWorld}
        className="rounded-full border border-white/15 px-4 py-3 text-xs text-white/75 active:scale-95"
      >
        ← Previous
      </button>

      <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">
        Swipe to discover
      </p>

      <button
        type="button"
        onClick={nextWorld}
        className="rounded-full border border-white/15 px-4 py-3 text-xs text-white/75 active:scale-95"
      >
        Next →
      </button>
    </div>
  </div>
</section>

);
}