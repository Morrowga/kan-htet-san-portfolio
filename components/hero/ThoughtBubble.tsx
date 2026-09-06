"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Seconds before the bubble draws itself (just ahead of the first tool tile). */
const START_DELAY = 3.1;

interface ThoughtBubbleProps {
  children: ReactNode;
  className?: string;
  /** Seconds before the bubble draws itself. Defaults to START_DELAY. */
  delay?: number;
}


/**
 * A thought bubble: a bordered, lightly frosted box with a trail of two
 * shrinking dots dropping from its bottom-left corner — the classic comic
 * "thinking" tail, aimed at whoever sits below-left (the portrait).
 *
 * Position it from the caller (e.g. `absolute left-5 right-5 top-[20svh]`);
 * the dots hang off whatever box that makes.
 */
export default function ThoughtBubble({ children, className = "", delay = START_DELAY }: ThoughtBubbleProps) {
  const reduceMotion = useReducedMotion();

  const surface = {
    background: "rgba(255,255,255,0.10)",
    border: "1.5px solid rgba(0,0,0,0.55)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 10px 24px -12px rgba(0,0,0,0.45)",
  } as const;

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="rounded-[5vw] px-[4vw] py-[3.5vw]" style={surface}>
        {children}
      </div>

      {/* Thinking tail — two dots trailing down toward the portrait */}
      <span
        className="absolute rounded-full"
        style={{ ...surface, width: "4.2vw", height: "4.2vw", left: "5vw", bottom: "-5.6vw" }}
      />
      <span
        className="absolute rounded-full"
        style={{ ...surface, width: "2.6vw", height: "2.6vw", left: "1.5vw", bottom: "-10.2vw" }}
      />
    </motion.div>
  );
}