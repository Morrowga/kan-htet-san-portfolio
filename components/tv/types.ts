import type { CSSProperties } from "react";

/** Which of the six frame assets to render. */
export type TvKindId = 1 | 2 | 3 | 4 | 5 | 6;

/** Frame PNG paths — drop in real files here without touching component code. */
export const TV_FRAME_SRC: Record<TvKindId, string> = {
  1: "/tv/tv-kind-1.webp",
  2: "/tv/tv-kind-2.webp",
  3: "/tv/tv-kind-3.webp",
  4: "/tv/tv-kind-4.webp",
  5: "/tv/tv-kind-5.webp",
  6: "/tv/tv-kind-6.webp",
};

/**
 * Default screen clip-path per kind (percentages: x% y%).
 * Measured from the actual frame PNGs after trimming and hole-punching,
 * so the clipped content and the transparent hole line up exactly.
 * Each is a slightly tilted quadrilateral, matching the 3D angle of the photo.
 */
export const SCREEN_CLIP_PATHS: Record<TvKindId, string> = {
  1: "polygon(14.7% 12.9%, 84.9% 13.0%, 85.6% 70.7%, 14.1% 70.9%)",
  2: "polygon(9.0% 18.3%, 71.0% 26.1%, 70.8% 78.2%, 9.0% 67.1%)",
  3: "polygon(10.0% 19.3%, 72.5% 28.0%, 73.0% 78.1%, 9.9% 67.0%)",
  4: "polygon(7.2% 16.6%, 74.8% 25.6%, 74.8% 79.7%, 7.4% 67.9%)",
  5: "polygon(7.4% 14.3%, 76.8% 21.2%, 77.2% 80.4%, 7.3% 70.7%)",
  6: "polygon(11.4% 13.6%, 68.4% 15.3%, 69.0% 78.5%, 11.0% 72.8%)",
};

/** Native width/height of each frame asset — lets the wrapper reserve height before the image loads. */
export const TV_ASPECT: Record<TvKindId, number> = {
  1: 1073 / 1021,
  2: 1227 / 1062,
  3: 1291 / 1053,
  4: 1344 / 1021,
  5: 1280 / 975,
  6: 889 / 1157,
};

export interface TvProps {
  /** Video or gif source shown inside the screen */
  contentSrc: string;
  /** "video" for looping muted mp4/webm, "gif" for an animated gif <img> */
  contentType: "video" | "gif";
  /** Optional override of the default screen clip-path for this instance */
  screenClipPath?: string;
  /** Width in px or CSS unit string — controls the rendered size of this TV instance */
  width: number | string;
  /** Rotation in degrees, for subtle mismatched-stack variance (e.g. -3 to 3) */
  rotate?: number;
  /** Horizontally flip the frame (mirror), for visual variety when reusing a kind */
  flip?: boolean;
  /** Standard positioning override, e.g. z-index for overlap stacking order */
  className?: string;
  style?: CSSProperties;
  /**
   * Second-stage media that replaces `contentSrc` after `revealDelayMs` —
   * e.g. swap the placeholder noise for the real clip once it's had a moment
   * to feel like a warming-up CRT. Omit to keep showing `contentSrc` forever.
   */
  revealSrc?: string;
  /** Media type for `revealSrc`. Defaults to "video". */
  revealType?: "video" | "gif";
  /** Delay in ms before switching from `contentSrc` to `revealSrc`. Defaults to 2000. */
  revealDelayMs?: number;
}