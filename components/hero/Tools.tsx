"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion } from "framer-motion";

/**
 * Tools, in display order. Each logo is /public/tools/<file>.webp —
 * drop the files in and edit this list; nothing else needs to change.
 */
export const TOOLS: { name: string; file: string }[] = [
  { name: "Premiere Pro", file: "pr" },
  { name: "CapCut", file: "capcut" },
  //   { name: "Sony", file: "sony" },
  { name: "Higgsfield", file: "higgsfield" },
  { name: "Kling", file: "kling" },
  { name: "Gemini", file: "gemini" },
];

/** Seconds before the first tile appears (after the captions have landed). */
const START_DELAY = 3.4;
/** Seconds between tiles. */
const STEP = 0.09;

interface ToolsProps {
  className?: string;
  /** Tiles per row. */
  columns?: number;
  /** Tile, logo and gap sizes as CSS lengths (vw keeps them scaling with the viewport). */
  tile?: string;
  logo?: string;
  gap?: string;
  /** Corner radius of the tile and logo. */
  radius?: string;
  /** Seconds before the first tile appears. Defaults to START_DELAY. */
  delay?: number;
}

/**
 * One "jelly" tile per tool — frosted glass over the grainy wall, a soft
 * edge glow — laid out `columns` per row. Tiles surface in order once the
 * captions have finished, then stay. Defaults are the desktop sizes; the
 * mobile instance passes its own.
 */
export default function Tools({
  className = "",
  columns = 6,
  tile = "5.2vw",
  logo = "3.4vw",
  gap = "1vw",
  radius = "1.3vw",
  delay = START_DELAY,
}: ToolsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${tile})`,
          gap,
          width: "max-content",
        }}
      >
        {TOOLS.map((tool, i) => (
          <motion.div
            key={tool.file}
            title={tool.name}
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              width: tile,
              height: tile,
              borderRadius: radius,
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.13) 45%, rgba(255,255,255,0.06) 100%)",
              backdropFilter: "blur(18px) saturate(1.15)",
              WebkitBackdropFilter: "blur(18px) saturate(1.15)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.08), inset 1px 0 0 rgba(255,255,255,0.35), 0 0.9vw 1.8vw -0.5vw rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.28)",
            }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: delay + i * STEP, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <img
              src={`/tools/${tool.file}.webp`}
              alt={tool.name}
              draggable={false}
              className="relative block select-none object-contain"
              style={{
                width: logo,
                height: logo,
                maxWidth: logo,
                maxHeight: logo,
                margin: "auto",
                borderRadius: `calc(${radius} * 0.55)`,
                filter: "drop-shadow(0 0.2vw 0.4vw rgba(0,0,0,0.25))",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}