/**
 * Backdrop — grainy grey/black gradient behind the hero.
 *
 * Two layers:
 *   1. The gradient: a soft sheen of light falling from the upper-left across
 *      a grey field, darkening toward the lower-right — the same lighting
 *      logic as a matte sphere, laid flat.
 *   2. Film grain: /public/grain.avif tiled at its native 256px and blended
 *      over the gradient so the grain reads as texture in the surface, not a
 *      screen on top of it.
 *
 * Tune the mood with the four stops in GRADIENT and GRAIN_OPACITY.
 */

const GRADIENT = {
  highlight: "#ececea", // brightest point of the sheen
  light: "#cfcfcc",
  mid: "#8f8f8c",
  shadow: "#3a3a39", // deepest corner
};

const GRAIN_OPACITY = 0.55;

export default function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {/* 1 — gradient field */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: GRADIENT.mid,
          backgroundImage: [
            `radial-gradient(120% 90% at 18% 8%, ${GRADIENT.highlight} 0%, ${GRADIENT.light} 28%, transparent 62%)`,
            `radial-gradient(90% 80% at 100% 100%, ${GRADIENT.shadow} 0%, transparent 60%)`,
            `linear-gradient(160deg, ${GRADIENT.light} 0%, ${GRADIENT.mid} 55%, ${GRADIENT.shadow} 100%)`,
          ].join(","),
        }}
      />
      {/* 2 — film grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/grain.avif)",
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
          mixBlendMode: "soft-light",
          opacity: GRAIN_OPACITY,
        }}
      />
    </div>
  );
}