"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const DRIVE_URL =
  "https://drive.google.com/drive/folders/14cjTsB-tRUb4ajiW_VlGpsGu-q-Ug7kx?usp=sharing";

interface FloatingCTAProps {
  label?: string;
  /** Fraction of viewport height scrolled before the button appears. */
  showAfter?: number;
}

/**
 * Fixed bottom-right pill button, jelly-glass styled to match Tools.
 * Hidden while the hero is in view (scrollY < showAfter * viewport height),
 * fades/slides in once the blog content is scrolled into view, and stays
 * visible regardless of further scroll depth.
 */
export default function FloatingCTA({
  label = "Full Portfolio",
  showAfter = 0.85,
}: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const threshold = () => window.innerHeight * showAfter;

    const onScroll = () => {
      setVisible(window.scrollY > threshold());
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [showAfter]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex select-none items-center gap-2 overflow-hidden whitespace-nowrap"
          style={{
            padding: "0.9rem 1.6rem",
            borderRadius: "999px",
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.13) 45%, rgba(255,255,255,0.06) 100%)",
            backdropFilter: "blur(18px) saturate(1.15)",
            WebkitBackdropFilter: "blur(18px) saturate(1.15)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.08), inset 1px 0 0 rgba(255,255,255,0.35), 0 0.9vw 1.8vw -0.5vw rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.28)",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#111",
          }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          whileHover={reduceMotion ? undefined : { scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        >
          <span>{label}</span>
          <span aria-hidden style={{ fontSize: "1.05em", lineHeight: 1 }}>
            ↗
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}