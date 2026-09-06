/* eslint-disable @next/next/no-img-element */
import Reels from "./Reels";

/**
 * Phone — the handset frame with a live reels feed on its screen.
 *
 * The frame is /public/phone.webp, a PNG-derived cutout with a transparent
 * screen hole. The screen box below is measured from that file (as % of the
 * frame's own size, padded ~5px so no sliver of backdrop shows through the
 * rounded corners); the frame is drawn on top, so anything past the hole is
 * hidden behind the bezel. Only `className` sizes and positions the phone —
 * everything inside scales with it.
 *
 * Lit like the rest of the hero: key light upper-left, so the shadow falls
 * down-and-right, plus a soft cast shadow onto the wall.
 */
const SCREEN = { left: "4.82%", top: "2.0%", width: "90.07%", height: "95.71%" };

interface PhoneProps {
  className?: string;
}

export default function Phone({ className = "" }: PhoneProps) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "705 / 1446", containerType: "inline-size" }} aria-hidden="true">
      {/* Cast shadow onto the wall */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "10%",
          right: "-14%",
          top: "6%",
          bottom: "-4%",
          background: "radial-gradient(ellipse at 45% 55%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0) 74%)",
          filter: "blur(9cqw)",
        }}
      />

      {/* Screen — sits under the frame, clipped to the hole */}
      <div
        className="absolute overflow-hidden"
        style={{ ...SCREEN, borderRadius: "10.5cqw", containerType: "inline-size" }}
      >
        <Reels />
      </div>

      {/* Frame on top */}
      <img
        src="/phone.webp"
        alt=""
        draggable={false}
        className="pointer-events-none relative block h-auto w-full select-none"
        style={{ filter: "drop-shadow(1.6cqw 2.2cqw 2.4cqw rgba(0,0,0,0.5))" }}
      />
    </div>
  );
}