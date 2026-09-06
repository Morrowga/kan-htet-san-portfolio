"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type CSSProperties } from "react";
import { SCREEN_CLIP_PATHS, TV_ASPECT, TV_FRAME_SRC, type TvKindId, type TvProps } from "./types";

interface TvBaseProps extends TvProps {
  kind: TvKindId;
}

const FILL_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/**
 * Shared renderer used by TvKind1…TvKind6.
 * Layers, bottom to top:
 *   [screen: solid fallback colour → base media → reveal media, all clipped
 *   together to the screen quad] → [frame PNG/WebP with transparent screen
 *   hole]
 *
 * If `revealSrc` is set, the reveal media (usually the real clip) starts
 * loading and playing immediately, muted and invisible, in parallel with the
 * base media (usually placeholder static) — so it's already buffered by the
 * time it's needed. It only fades in once BOTH `revealDelayMs` has elapsed
 * AND the browser reports it's actually ready to play (`canplay` / `load`),
 * whichever comes later. That means: never an empty/blank screen — the base
 * media (or the solid fallback colour, if even that hasn't loaded yet) stays
 * visible for as long as it takes, and the swap is a soft crossfade rather
 * than a hard cut.
 *
 * Positioning is owned by the caller via `style` (TvStack passes
 * `position: absolute` + `left` / `bottom`). We deliberately do NOT add a
 * `relative` class here — it would override `absolute` and drop the unit back
 * into normal flow.
 */
export default function TvBase({
  kind,
  contentSrc,
  contentType,
  revealSrc,
  revealType = "video",
  revealDelayMs = 2000,
  screenClipPath,
  width,
  rotate = 0,
  flip = false,
  className = "",
  style,
}: TvBaseProps) {
  const clipPath = screenClipPath ?? SCREEN_CLIP_PATHS[kind];

  // Flip is applied to the whole unit so the clip quad mirrors with the frame.
  const transform = `${rotate ? `rotate(${rotate}deg)` : ""} ${flip ? "scaleX(-1)" : ""}`.trim();

  const [delayDone, setDelayDone] = useState(false);
  const [revealReady, setRevealReady] = useState(false);

  useEffect(() => {
    if (!revealSrc) return;
    const timer = setTimeout(() => setDelayDone(true), revealDelayMs);
    return () => clearTimeout(timer);
  }, [revealSrc, revealDelayMs]);

  const showReveal = Boolean(revealSrc) && delayDone && revealReady;

  const wrapperStyle: CSSProperties = {
    position: "relative",
    width,
    aspectRatio: String(TV_ASPECT[kind]),
    transform: transform || undefined,
    transformOrigin: "center bottom",
    ...style,
  };

  const fade = (visible: boolean): CSSProperties => ({
    ...FILL_STYLE,
    opacity: visible ? 1 : 0,
    transition: "opacity 0.7s ease",
  });

  return (
    <div className={`select-none ${className}`} style={wrapperStyle}>
      {/* Screen: solid fallback so a slow-loading source shows an "off" screen, never a hole through to the backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath,
          WebkitClipPath: clipPath,
          backgroundColor: "#161616",
          overflow: "hidden",
        }}
      >
        {contentType === "video" ? (
          <video style={fade(!showReveal)} src={contentSrc} autoPlay muted loop playsInline preload="auto" />
        ) : (
          <img style={fade(!showReveal)} src={contentSrc} alt="" draggable={false} />
        )}

        {revealSrc &&
          (revealType === "video" ? (
            <video
              style={fade(showReveal)}
              src={revealSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setRevealReady(true)}
            />
          ) : (
            <img style={fade(showReveal)} src={revealSrc} alt="" draggable={false} onLoad={() => setRevealReady(true)} />
          ))}
      </div>

      <img
        src={TV_FRAME_SRC[kind]}
        alt=""
        draggable={false}
        style={{ position: "relative", display: "block", width: "100%", height: "auto", pointerEvents: "none" }}
      />
    </div>
  );
}