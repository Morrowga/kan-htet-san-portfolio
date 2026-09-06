/**
 * TvStack — the stacked CRT wall.
 *
 * HOW IT WORKS
 * The stack is a 4:3 `position: relative` box. Every television is
 * `position: absolute`, anchored to the FLOOR of that box: `x` and `width`
 * are % of the box width, `y` is how high the unit's bottom edge sits above
 * the floor, also in % of the box width (so rows stack like real objects and
 * the whole wall scales as one). Heights come from each frame's native
 * aspect ratio.
 *
 * Rows are laid out like a real hand-stacked wall: four wide units on the
 * floor, then 5 / 4 / 3 climbing to a peak. Each unit rests on the ones
 * beneath it (y ≈ top edge of the units below, minus a hair of overlap so
 * nothing floats). Lower rows get a higher zIndex so they read as "in front",
 * and units to the right sit above units to the left so the frames' right
 * side faces tuck behind their neighbours.
 *
 * HOW TO ADD A TV
 * Append one object to `TV_INSTANCES`. Pick a `kind` (1–6), a unique `id`,
 * `x` / `y` / `width` in % of box width, and a `contentSrc`. Optional:
 * `rotate`, `flip`, `zIndex`, `contentType` ("gif" | "video"), `screenClipPath`.
 */
import type { ComponentType } from "react";
import TvKind1 from "./TvKind1";
import TvKind2 from "./TvKind2";
import TvKind3 from "./TvKind3";
import TvKind4 from "./TvKind4";
import TvKind5 from "./TvKind5";
import TvKind6 from "./TvKind6";
import type { TvKindId, TvProps } from "./types";

/** Width / height of the stack box. Keep in sync with the aspect class below. */
export const STACK_ASPECT = 4 / 3;

export interface TvInstanceConfig {
  id: string;
  kind: TvKindId;
  x: number;
  y: number;
  width: number;
  rotate?: number;
  flip?: boolean;
  zIndex?: number;
  contentSrc: string;
  contentType?: TvProps["contentType"];
  screenClipPath?: string;
  /** Per-unit override of the shared reveal clip (see REVEAL_SRC below) */
  revealSrc?: string;
  revealType?: TvProps["contentType"];
  revealDelayMs?: number;
}

const KIND_COMPONENT: Record<TvKindId, ComponentType<TvProps>> = {
  1: TvKind1,
  2: TvKind2,
  3: TvKind3,
  4: TvKind4,
  5: TvKind5,
  6: TvKind6,
};

const gif = (n: number): string => `/tv-gifs/static.gif`;

const REVEAL_SRC: string | undefined = "/tv-mp4/show.mp4";
const REVEAL_DELAY_MS = 2000;

export const TV_INSTANCES: TvInstanceConfig[] = [
  // Floor row — the base. Units overlap their left neighbour by ~4% so no
  // background shows between them; rows sit ~3–4% into the row beneath.
  { id: "f1", kind: 3, x: 0,  y: 0,    width: 28, zIndex: 41, contentSrc: gif(1) },
  { id: "f2", kind: 5, x: 23, y: 0,    width: 25, zIndex: 42, contentSrc: gif(2) },
  { id: "f3", kind: 4, x: 43, y: 0,    width: 27, zIndex: 43, contentSrc: gif(3) },
  { id: "f4", kind: 5, x: 65, y: 0,    width: 34, zIndex: 44, contentSrc: gif(4) },

  // Row 2 — five units
  { id: "r2a", kind: 1, x: 3,  y: 18,   width: 22, rotate: -0.6, zIndex: 31, contentSrc: gif(5) },
  { id: "r2b", kind: 2, x: 20, y: 15,   width: 27, zIndex: 32, contentSrc: gif(6) },
  { id: "r2c", kind: 4, x: 42, y: 15.5, width: 27, rotate: 0.5, zIndex: 33, contentSrc: gif(7) },
  { id: "r2d", kind: 1, x: 64, y: 21,   width: 21, zIndex: 34, contentSrc: gif(8) },
  { id: "r2e", kind: 6, x: 81, y: 21,   width: 16, rotate: 0.8, zIndex: 35, contentSrc: gif(9) },

  // Row 3 — four units
  { id: "r3a", kind: 2, x: 8,  y: 34,   width: 25, rotate: -0.4, zIndex: 21, contentSrc: gif(10) },
  { id: "r3b", kind: 5, x: 28, y: 33.5, width: 26, rotate: -0.8, zIndex: 22, contentSrc: gif(11) },
  { id: "r3c", kind: 3, x: 49, y: 32,   width: 25, zIndex: 23, contentSrc: gif(12) },
  { id: "r3d", kind: 4, x: 69, y: 36.5, width: 27, rotate: 0.6, zIndex: 24, contentSrc: gif(13) },

  // Peak row — three units
  { id: "p1", kind: 6, x: 21, y: 51,   width: 16, rotate: -1, zIndex: 11, contentSrc: gif(14) },
  { id: "p2", kind: 1, x: 34, y: 49.5, width: 20, zIndex: 12, contentSrc: gif(15) },
  { id: "p3", kind: 2, x: 52, y: 48.5, width: 22, rotate: 0.8, zIndex: 13, contentSrc: gif(16) },
];
/**
 * Lighting — matches the Backdrop: one soft key light from the upper-left.
 *   • Units further right and lower in the stack receive less light, so each
 *     unit is dimmed by its position (brightness falloff).
 *   • Each unit casts a shadow down-and-right onto whatever is behind it —
 *     the wall, or the unit beneath — via a drop-shadow that follows the
 *     frame's alpha.
 *   • The whole wall casts one large soft shadow onto the wall behind it, and
 *     sits on a contact shadow at the floor.
 */
const LIGHT = {
  /** How much the far (bottom-right) corner dims: 0 = none, 0.5 = half brightness */
  falloff: 0.38,
  /** Shadow offset & blur, % of stack width — keeps direction consistent at any size */
  shadowX: 1.4,
  shadowY: 1.8,
  shadowBlur: 1.6,
  shadowAlpha: 0.55,
};

function unitLighting(tv: TvInstanceConfig): string {
  // 0 at the lit top-left, 1 at the dark bottom-right
  const cx = (tv.x + tv.width / 2) / 100;
  const cy = 1 - Math.min(tv.y / 60, 1); // y is height above floor
  const dist = Math.min(1, cx * 0.6 + cy * 0.4);
  const brightness = (1 - LIGHT.falloff * dist).toFixed(3);
  return `brightness(${brightness}) drop-shadow(${LIGHT.shadowX}cqw ${LIGHT.shadowY}cqw ${LIGHT.shadowBlur}cqw rgba(0,0,0,${LIGHT.shadowAlpha}))`;
}

interface TvStackProps {
  className?: string;
}

export default function TvStack({ className = "" }: TvStackProps) {
  // y is in % of width; CSS `bottom` is % of height — convert.
  const bottomPct = (y: number) => `${y * STACK_ASPECT}%`;

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: "4 / 3", containerType: "inline-size" }}
      aria-hidden="true"
    >
      {/* Cast shadow of the whole wall onto the backdrop, thrown down-right */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "8%",
          right: "-10%",
          top: "22%",
          bottom: "-6%",
          background: "radial-gradient(ellipse at 45% 60%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 72%)",
          filter: "blur(14cqw)",
          zIndex: 0,
        }}
      />
      {/* Contact shadow where the bottom row meets the floor */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "-2%",
          right: "-4%",
          bottom: "-3%",
          height: "12%",
          background: "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(2.5cqw)",
          zIndex: 1,
        }}
      />

      {TV_INSTANCES.map((tv) => {
        const Tv = KIND_COMPONENT[tv.kind];
        return (
          <Tv
            key={tv.id}
            style={{
              position: "absolute",
              left: `${tv.x}%`,
              bottom: bottomPct(tv.y),
              zIndex: (tv.zIndex ?? 0) + 2,
              filter: unitLighting(tv),
            }}
            width={`${tv.width}%`}
            rotate={tv.rotate}
            flip={tv.flip}
            contentSrc={tv.contentSrc}
            contentType={tv.contentType ?? "gif"}
            screenClipPath={tv.screenClipPath}
            revealSrc={tv.revealSrc ?? REVEAL_SRC}
            revealType={tv.revealType ?? "video"}
            revealDelayMs={tv.revealDelayMs ?? REVEAL_DELAY_MS}
          />
        );
      })}
    </div>
  );
}
