"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion } from "framer-motion";

/** Swap the real portrait in at /public/person.png — no code change needed. */
export const PERSON_SRC = "/person.webp";

/** Flip to false to show the portrait in colour. */
export const PERSON_GRAYSCALE = true;

/** How much of the portrait is pushed off the left edge. 50 = half hidden. */
export const PERSON_HIDDEN_PERCENT = 50;

interface PersonProps {
  className?: string;
}

/**
 * Portrait, pinned to the bottom-left of the hero and pushed half its own
 * width past the left edge, so only the right 50% of the image is visible.
 * The hero section clips the rest. The offset lives on a plain wrapper so
 * framer-motion's `x` on the inner element can't overwrite it.
 */
export default function Person({ className = "" }: PersonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute left-0 ${className}`}
      style={{ transform: `translateX(-${PERSON_HIDDEN_PERCENT}%)` }}
    >
      <motion.div
        className="h-full"
        initial={{ opacity: 0, x: reduceMotion ? 0 : -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <img
          src={PERSON_SRC}
          alt="Portrait"
          draggable={false}
          className="block h-full w-auto max-w-none object-contain object-bottom"
          style={{ filter: PERSON_GRAYSCALE ? "grayscale(100%)" : undefined }}
        />
      </motion.div>
    </div>
  );
}
