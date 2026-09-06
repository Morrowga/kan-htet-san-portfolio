"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** The lines, in order. Add, remove or reword freely. */
export const CAPTIONS = [
  "A content creator",
  "Over a hundred videos edited",
  "Based in Chiang Mai",
];

/** Seconds to wait before the first line (lets the title finish its reveal). */
const START_DELAY = 1;
/** Seconds between one line appearing and the next. */
const STEP = 0.75;
/** How far each successive line steps to the right, in em of the caption size. Used only where the caller's className includes the staircase layout (desktop). */
const INDENT = 7;

interface CaptionsProps {
  /**
   * Fully controls layout (display, position, gap, etc.) — this component
   * makes no display assumptions of its own, so the same list can be
   * rendered as a single row in one place and a staircase in another.
   */
  className?: string;
  /** Overrides the default responsive font size — pass a smaller clamp() where space is tight (e.g. the mobile single row). */
  textSize?: string;
}

/**
 * Opening-titles captions. Lines surface one after another and stay.
 * Purely presentational: pass a `className` that lays the lines out as a
 * single row (flex) or as a staircase (block, each stepped right via the
 * `--step` custom property already threaded onto each line). Plays once on
 * load; nothing loops.
 */
export default function Captions({ className = "", textSize = "clamp(0.95rem, 1.8vw, 2rem)" }: CaptionsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`pointer-events-none select-none font-normal leading-snug tracking-[0] text-black/85 ${className}`}
      style={{
        fontSize: textSize,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {CAPTIONS.map((line, i) => (
        <motion.p
          key={i}
          className="whitespace-nowrap [.stair_&]:mt-[0.45em] [.stair_&]:ml-[calc(var(--step)*1em)] [.stair_&]:first:mt-0"
          style={{ "--step": i * INDENT } as CSSProperties}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: START_DELAY + i * STEP, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {"\u201C"}{line}{"\u201D"}
        </motion.p>
      ))}
    </div>
  );
}