"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CommentIcon,
  HeartIcon,
  HomeIcon,
  MoreIcon,
  PlusIcon,
  ReelsIcon,
  RepostIcon,
  SearchIcon,
  ShareIcon,
  SlidersIcon,
  UserIcon,
  VerifiedIcon,
} from "./icons";

/** One clip, looped in every reel. Drop the real file at public/tv-mp4/show.mp4. */
export const REEL_VIDEO_SRC = "/tv-mp4/show.mp4";

/** How long each reel stays on screen before the feed scrolls to the next. */
export const REEL_DURATION_MS = 3000;

/** Handle shown on every reel. */
export const HANDLE = "kanhtetsan";

/** One entry per reel — 14 of them. Edit captions and counts freely. */
export const REELS: { caption: string; likes: string; comments: string; shares: string }[] = [
  { caption: "POV: the edit finally clicks at 3am", likes: "2M", comments: "6,965", shares: "344K" },
  { caption: "Every cut has a reason. Here's one", likes: "1.4M", comments: "4,120", shares: "212K" },
  { caption: "Chiang Mai, 6:12am, one take", likes: "980K", comments: "2,310", shares: "97K" },
  { caption: "Before / after colour. Same footage", likes: "1.1M", comments: "3,480", shares: "150K" },
  { caption: "The transition nobody asked for", likes: "3.2M", comments: "9,801", shares: "512K" },
  { caption: "100 videos in. Still learning", likes: "760K", comments: "1,905", shares: "68K" },
  { caption: "Sound design does the heavy lifting", likes: "1.7M", comments: "5,220", shares: "290K" },
  { caption: "Shot on a phone. Edited on a laptop", likes: "2.6M", comments: "7,414", shares: "401K" },
  { caption: "Slow zoom. Hold. Cut on the beat", likes: "890K", comments: "2,077", shares: "88K" },
  { caption: "Client said 'make it feel cinematic'", likes: "1.9M", comments: "6,102", shares: "333K" },
  { caption: "Rainy season B-roll dump", likes: "640K", comments: "1,556", shares: "52K" },
  { caption: "Timeline tour. 43 layers, no regrets", likes: "1.3M", comments: "3,903", shares: "178K" },
  { caption: "Night market at 240fps", likes: "2.2M", comments: "6,640", shares: "365K" },
  { caption: "That's the reel. Follow for the next one", likes: "4.1M", comments: "12,280", shares: "690K" },
];

interface ReelsProps {
  /** Wall-clock shown in the status bar. */
  clock?: string;
}

/**
 * A reels-style feed that scrolls itself: 14 full-screen reels, each looping
 * the same clip, advancing every REEL_DURATION_MS with a soft slide. Header
 * and bottom nav stay fixed; the right-hand action rail and caption travel
 * with each reel. The feed wraps: after the last reel it slides to a clone of
 * the first, then snaps back to the real first with no visible jump.
 *
 * Sizes use container-query units (cqw) so the whole UI scales with the
 * phone — the parent must set `container-type: inline-size`.
 *
 * Only the current reel and its neighbours keep a live <video>; the rest are
 * black, so 14 reels cost about three decoders, not fourteen.
 */
export default function Reels({ clock = "21:46" }: ReelsProps) {
  const n = REELS.length;
  const [tick, setTick] = useState(0); // counts up forever
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), REEL_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  // Position on the track, always within 0..n. Ticks 1..n map to slides 1..n
  // (n = the clone of the first reel); the next tick maps to 1 again, and so on.
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (tick === 0) return;
    const next = ((tick - 1) % n) + 1;
    setInstant(false);
    setIndex(next);
    if (next !== n) return;
    // Slid onto the clone: after the slide finishes, snap to the real first reel.
    const snap = setTimeout(() => {
      setInstant(true);
      setIndex(0);
    }, 750);
    return () => clearTimeout(snap);
  }, [tick, n]);

  // Coming back from a background tab: don't replay a stale slide, just land.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") setInstant(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const items = [...REELS, REELS[0]];

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black text-white"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      {/* Scrolling feed */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: `-${index * 100}%` }}
        transition={instant ? { duration: 0 } : { duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
      >
        {items.map((reel, i) => {
          const live = Math.abs(i - index) <= 1;
          return (
            <div key={i} className="relative h-full w-full overflow-hidden bg-black">
              {live && (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={REEL_VIDEO_SRC}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              )}

              {/* Legibility gradients */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-black/60 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

              {/* Right rail */}
              <div className="absolute bottom-[19%] right-[3.5cqw] flex flex-col items-center gap-[5cqw]">
                <Rail icon={<HeartIcon />} label={reel.likes} />
                <Rail icon={<CommentIcon />} label={reel.comments} />
                <Rail icon={<RepostIcon />} label="55.8K" />
                <Rail icon={<ShareIcon />} label={reel.shares} />
                <MoreIcon style={{ width: "6.5cqw", height: "6.5cqw" }} />
              </div>

              {/* Caption block */}
              <div className="absolute bottom-[14.5%] left-[4cqw] right-[18cqw]">
                <div className="flex items-center gap-[2.5cqw]">
                  <span
                    className="grid place-items-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[0.5cqw]"
                    style={{ width: "10cqw", height: "10cqw" }}
                  >
                    <span className="grid h-full w-full place-items-center rounded-full bg-black">
                      <UserIcon style={{ width: "5.5cqw", height: "5.5cqw" }} />
                    </span>
                  </span>
                  <span className="flex items-center gap-[1.5cqw] font-semibold" style={{ fontSize: "4cqw" }}>
                    {HANDLE}
                    <VerifiedIcon style={{ width: "3.8cqw", height: "3.8cqw", color: "#3897f0" }} />
                  </span>
                  <span
                    className="ml-[1cqw] rounded-[1.5cqw] border border-white/70 px-[2.8cqw] py-[1.1cqw] font-medium"
                    style={{ fontSize: "3.4cqw" }}
                  >
                    Follow
                  </span>
                </div>
                <p className="mt-[2.6cqw] truncate" style={{ fontSize: "3.7cqw" }}>
                  {reel.caption}…
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Fixed chrome — status bar, header tabs, bottom nav */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-[7cqw] font-semibold"
        style={{ top: "3.4cqw", height: "6.5cqw", fontSize: "4.2cqw" }}
      >
        <span>{clock}</span>
        <span className="flex items-center gap-[1.4cqw]">
          <Signal />
          <span style={{ fontSize: "3.6cqw" }}>5G</span>
          <span
            className="rounded-[0.9cqw] bg-white px-[1.2cqw] text-black"
            style={{ fontSize: "3.2cqw", lineHeight: "4.6cqw" }}
          >
            82
          </span>
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 flex items-center justify-between px-[5cqw]"
        style={{ top: "15.5cqw", height: "8cqw" }}
      >
        <PlusIcon style={{ width: "6.5cqw", height: "6.5cqw" }} />
        <div className="flex items-baseline gap-[5cqw] font-bold" style={{ fontSize: "5.6cqw" }}>
          <span>Reels</span>
          <span className="text-white/45">Friends</span>
        </div>
        <SlidersIcon style={{ width: "6.5cqw", height: "6.5cqw" }} />
      </div>

      <div
        className="pointer-events-none absolute inset-x-[4cqw] flex items-center justify-around rounded-full bg-neutral-900/85"
        style={{ bottom: "3.2cqw", height: "12cqw" }}
      >
        <HomeIcon style={{ width: "6.4cqw", height: "6.4cqw" }} />
        <span className="grid place-items-center rounded-full bg-white/15" style={{ width: "18cqw", height: "9.5cqw" }}>
          <ReelsIcon style={{ width: "6.4cqw", height: "6.4cqw" }} />
        </span>
        <ShareIcon style={{ width: "6.4cqw", height: "6.4cqw" }} />
        <SearchIcon style={{ width: "6.4cqw", height: "6.4cqw" }} />
        <UserIcon style={{ width: "6.4cqw", height: "6.4cqw" }} />
      </div>
      {/* Home indicator */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-white/80"
        style={{ bottom: "1cqw", width: "34cqw", height: "1.1cqw" }}
      />
    </div>
  );
}

function Rail({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-[1cqw]">
      <span className="[&>svg]:h-[7cqw] [&>svg]:w-[7cqw]">{icon}</span>
      <span className="font-medium" style={{ fontSize: "3.1cqw" }}>
        {label}
      </span>
    </div>
  );
}

function Signal() {
  return (
    <span className="flex items-end gap-[0.5cqw]">
      {[0.4, 0.6, 0.8, 1].map((h, i) => (
        <span
          key={i}
          className={i < 3 ? "bg-white" : "bg-white/35"}
          style={{ width: "0.9cqw", height: `${h * 3.2}cqw`, borderRadius: "0.3cqw" }}
        />
      ))}
    </span>
  );
}