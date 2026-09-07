"use client";

import { motion, useReducedMotion } from "framer-motion";

const DRIVE_URL =
  "https://drive.google.com/drive/folders/14cjTsB-tRUb4ajiW_VlGpsGu-q-Ug7kx?usp=sharing";

interface ProjectButtonProps {
  className?: string;
  /** Seconds before it appears. */
  delay?: number;
  /** Size overrides — defaults match the current desktop sizing. */
  width?: string;
  fontSize?: string;
  padding?: string;
  radius?: string;
}

/**
 * Long jelly-glass pill under the Tools grid — same frosted-glass treatment
 * (gradient, blur, inset highlights) as each Tools tile, just elongated
 * horizontally. Links straight to the Drive folder, same as the Blog CTA.
 * Sizing is prop-driven so the same component can be reused smaller/larger
 * (e.g. the mobile floating instance in Hero.tsx).
 */
export default function ProjectButton({
  className = "",
  delay = 1.9,
  width = "80%",
  fontSize = "1.5vw",
  padding = "0.3vw 0",
  radius = "1.3vw",
}: ProjectButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={DRIVE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`pointer-events-auto z-10 mt-5 flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width,
        padding,
        borderRadius: radius,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.13) 45%, rgba(255,255,255,0.06) 100%)",
        backdropFilter: "blur(18px) saturate(1.15)",
        WebkitBackdropFilter: "blur(18px) saturate(1.15)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.08), inset 1px 0 0 rgba(255,255,255,0.35), 0 0.9vw 1.8vw -0.5vw rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.28)",
        fontSize,
        fontWeight: 600,
        color: "#302f2c",
        cursor: "pointer",
      }}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
    >
      Click Here to View My Portfolio
    </motion.a>
  );
}