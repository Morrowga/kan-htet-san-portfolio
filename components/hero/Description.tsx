"use client";

import { motion, useReducedMotion } from "framer-motion";

/** One-line description used on mobile in place of the three captions. */
export const DESCRIPTION = "A content creator based in Chiang Mai, over a hundred videos edited.";

/** Seconds before it appears (after the title's reveal). */
const START_DELAY = 1;

interface DescriptionProps {
  className?: string;
}

export default function Description({ className = "" }: DescriptionProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.p
      className={`pointer-events-none select-none font-normal leading-snug text-black/80 ${className}`}
      style={{
        fontSize: "clamp(0.8rem, 3.4vw, 1rem)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: START_DELAY, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {DESCRIPTION}
    </motion.p>
  );
}