"use client";

import { useEffect, useRef, useState } from "react";
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

/** How long each reel STAYS VISIBLE (i.e. is actually playing) before the
 *  feed scrolls to the next — counted from when its video starts playing,
 *  not from when it was requested. */
export const REEL_DURATION_MS = 3000;

/** Safety net: if a reel's video never fires "playing" (slow network, bad
 *  file, etc.), advance anyway after this long so the feed can't stall. */
const READY_FALLBACK_MS = 8000;

/** The two profiles that appear in the feed. */
const PROFILES = {
  p1: {
    handle: "trevourfosterstudio",
    verified: true,
    image: "/profile/1.webp",
  },
  p2: {
    handle: "I_kan_do_it",
    verified: false,
    image: "/profile/2.webp",
  },
};

/** The 4 real posts. Video 1 & 2 belong to profile 1, video 3 & 4 to profile 2. */
const POSTS = [
  { video: "/tv-mp4/1.mp4", caption: "Glazing Art", profile: PROFILES.p1 },
  { video: "/tv-mp4/2.mp4", caption: "Kickstarter", profile: PROFILES.p1 },
  { video: "/tv-mp4/3.mp4", caption: "My Directing Project", profile: PROFILES.p2 },
  { video: "/tv-mp4/4.mp4", caption: "Product Videography", profile: PROFILES.p2 },
];

/** Engagement numbers for 14 feed slots — cycled with POSTS below so the feed
 *  still scrolls through 14 stops while only ever showing the 4 real posts. */
const ENGAGEMENT: { likes: string; comments: string; shares: string }[] = [
  { likes: "2M", comments: "6,965", shares: "344K" },
  { likes: "1.4M", comments: "4,120", shares: "212K" },
  { likes: "980K", comments: "2,310", shares: "97K" },
  { likes: "1.1M", comments: "3,480", shares: "150K" },
  { likes: "3.2M", comments: "9,801", shares: "512K" },
  { likes: "760K", comments: "1,905", shares: "68K" },
  { likes: "1.7M", comments: "5,220", shares: "290K" },
  { likes: "2.6M", comments: "7,414", shares: "401K" },
  { likes: "890K", comments: "2,077", shares: "88K" },
  { likes: "1.9M", comments: "6,102", shares: "333K" },
  { likes: "640K", comments: "1,556", shares: "52K" },
  { likes: "1.3M", comments: "3,903", shares: "178K" },
  { likes: "2.2M", comments: "6,640", shares: "365K" },
  { likes: "4.1M", comments: "12,280", shares: "690K" },
];

/** One entry per reel — 14 of them, cycling through the 4 real posts. */
export const REELS: {
  caption: string;
  likes: string;
  comments: string;
  shares: string;
  video: string;
  profile: { handle: string; verified: boolean; image: string };
}[] = ENGAGEMENT.map((e, i) => ({ ...e, ...POSTS[i % POSTS.length] }));

interface ReelsProps {
  /** Wall-clock shown in the status bar. */
  clock?: string;
}

/**
 * A reels-style feed that scrolls itself: 14 full-screen reels (cycling 4
 * real clips/profiles), each looping its clip. Each reel's on-screen timer
 * only starts once its video is actually playing (not black/loading), so
 * the feed never scrolls into or away from an unfinished-loading clip.
 * Header and bottom nav stay fixed; the right-hand action rail and caption
 * travel with each reel. The feed wraps: after the last reel it slides to a
 * clone of the first, then snaps back to the real first with no visible jump.
 *
 * Sizes use container-query units (cqw) so the whole UI scales with the
 * phone — the parent must set `container-type: inline-size`.
 *
 * Only the current reel and its neighbours keep a live <video>; the rest are
 * black, so 14 reels cost about three decoders, not fourteen.
 */

/**
 * iOS-safe autoplaying video: sets `muted` as a real attribute, starts
 * playback explicitly, shows a spinner until the first frame is playing,
 * and reports "ready" upward via onReady once playback actually starts.
 */
function ReelVideo({ src, onReady }: { src: string; onReady?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setReady(false);
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    const start = () => el.play().catch(() => {});
    const onPlaying = () => {
      setReady(true);
      onReady?.();
    };
    start();
    el.addEventListener("loadedmetadata", start);
    el.addEventListener("canplay", start);
    el.addEventListener("playing", onPlaying);
    return () => {
      el.removeEventListener("loadedmetadata", start);
      el.removeEventListener("canplay", start);
      el.removeEventListener("playing", onPlaying);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Loading indicator — fades out once the clip is playing */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-500"
        style={{ opacity: ready ? 0 : 1 }}
      >
        <span
          className="block animate-spin rounded-full border-white/25 border-t-white"
          style={{ width: "9cqw", height: "9cqw", borderWidth: "0.7cqw" }}
        />
      </div>
    </>
  );
}

export default function Reels({ clock = "21:46" }: ReelsProps) {
  const n = REELS.length;
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);

  // Always-current index, readable from timer callbacks without stale closures.
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    advanceTimerRef.current = null;
    fallbackTimerRef.current = null;
  };

  const advance = () => {
    setInstant(false);
    setIndex((prev) => prev + 1);
  };

  // Called once the CURRENT reel's video actually starts playing (or the
  // fallback timeout elapses). Only then does the on-screen countdown to
  // the next reel begin — so a slow-loading clip gets its full visible
  // time instead of losing seconds to a black loading screen.
  const handleReady = () => {
    if (indexRef.current === n) return; // clone slide manages its own timing
    if (advanceTimerRef.current) return; // already scheduled
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    advanceTimerRef.current = setTimeout(advance, REEL_DURATION_MS);
  };

  // Only the reel matching the current index should be able to trigger the
  // countdown — neighbours preloading in the background shouldn't.
  const handleVideoReady = (videoIndex: number) => {
    if (videoIndex !== indexRef.current) return;
    handleReady();
  };

  useEffect(() => {
    clearAllTimers();

    if (index === n) {
      // On the clone slide — just let the slide finish, then snap to the
      // real first reel. This is a brief visual transition, not something
      // the viewer "watches", so it isn't gated on video readiness.
      const snap = setTimeout(() => {
        setInstant(true);
        setIndex(0);
      }, 750);
      return () => clearTimeout(snap);
    }

    // Safety net: if this reel's video never fires "playing", don't stall
    // the feed forever — advance after READY_FALLBACK_MS regardless.
    fallbackTimerRef.current = setTimeout(handleReady, READY_FALLBACK_MS);

    return () => clearAllTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, n]);

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
              {live && <ReelVideo src={reel.video} onReady={() => handleVideoReady(i)} />}

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
                    <span className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-black">
                      {reel.profile.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={reel.profile.image}
                          alt={reel.profile.handle}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon style={{ width: "5.5cqw", height: "5.5cqw" }} />
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-[1.5cqw] font-semibold" style={{ fontSize: "4cqw" }}>
                    {reel.profile.handle}
                    {reel.profile.verified && (
                      <VerifiedIcon style={{ width: "3.8cqw", height: "3.8cqw", color: "#3897f0" }} />
                    )}
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