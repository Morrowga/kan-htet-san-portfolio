"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Change the name here. Each word is revealed on its own, in order. */
export const TITLE = "KAN";

/** Seconds between one word starting and the next word starting. */
const WORD_GAP = 0.5;
/** Delay before the first word begins. */
const LEAD_IN = 0.10;

interface TitleProps {
  className?: string;
}

/**
 * Logo-style cinematic reveal, one word at a time. Each word surfaces out of
 * darkness — a dim, soft, slightly enlarged ghost that resolves into crisp
 * black type (dark → light). Nothing loops. Reduced-motion users get a plain
 * sequential fade.
 */
export default function Title({ className = "" }: TitleProps) {
  const reduceMotion = useReducedMotion();
  const words = TITLE.split(" ");

  return (
    <h1
      className={`select-none leading-[0.9] tracking-[0.02em] ${className}`}
      style={{
        fontSize: "clamp(2.75rem, 7.2vw, 8.5rem)",
        fontFamily: 'var(--font-display), "Jockey One", system-ui, sans-serif',
      }}
      aria-label={TITLE}
    >
      {words.map((word, i) => {
        const start = LEAD_IN + i * WORD_GAP;
        return (
          <motion.span
            key={i}
            className="mr-[0.24em] inline-block align-top will-change-transform last:mr-0"
            aria-hidden="true"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.08, filter: "blur(14px) brightness(0.35)", color: "#1a1a1a" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", color: "#000000" }}
            transition={{ duration: 1.1, delay: start, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {word}
          </motion.span>
        );
      })}
    </h1>
  );
}