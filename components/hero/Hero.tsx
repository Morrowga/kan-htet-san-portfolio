"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Person from "./Person";
import Title from "./Title";
import Backdrop from "./Backdrop";
import Captions from "./Captions";
import Description from "./Description";
import Tools from "./Tools";
import ThoughtBubble from "./ThoughtBubble";
import Phone from "@/components/phone/Phone";
import Blog from "@/components/blog/Blog";

/**
 * Hero — one pinned frame for the whole page. The viewport never moves;
 * scrolling drives a timeline inside it (so speed and direction are the
 * user's):
 *
 *   0 → 0.55vh   the pieces leave the stage: portrait slides out left, phone
 *                slides out right, tools fade flat, then the title/captions
 *   0.6 → 0.85vh the blog fades in over the same wall
 *   0.85vh →     the blog column scrolls 1:1 inside the frame until its end
 *
 * The scrollable height is measured from the blog's real content, so adding
 * posts just makes the page longer.
 */

/** Scroll distance, as a fraction of viewport height, for each beat of the timeline. */
const EXIT_END = 0.55;
const BLOG_IN_START = 0.6;
const BLOG_IN_END = 0.85;

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const blogRef = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(800);
  const [blogH, setBlogH] = useState(0);

  // Measure viewport and the blog column so the timeline lengths are exact.
  useEffect(() => {
    const measure = () => {
      setVh(window.innerHeight);
      if (blogRef.current) setBlogH(blogRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (blogRef.current) ro.observe(blogRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const blogScroll = Math.max(0, blogH - vh); // how far the column must travel inside the frame
  const totalScroll = BLOG_IN_END * vh + blogScroll; // page length beyond the first viewport

  const { scrollY } = useScroll();

  const personX = useTransform(scrollY, [0, EXIT_END * vh], ["0%", reduceMotion ? "0%" : "-45%"]);
  const personOpacity = useTransform(scrollY, [0, EXIT_END * vh * 0.9], [1, 0]);
  const phoneX = useTransform(scrollY, [0, EXIT_END * vh], ["0%", reduceMotion ? "0%" : "45%"]);
  const phoneOpacity = useTransform(scrollY, [0, EXIT_END * vh * 0.9], [1, 0]);
  const toolsOpacity = useTransform(scrollY, [0, EXIT_END * vh * 0.45], [1, 0]);
  const textOpacity = useTransform(scrollY, [EXIT_END * vh * 0.3, EXIT_END * vh], [1, 0]);

  const blogOpacity = useTransform(scrollY, [BLOG_IN_START * vh, BLOG_IN_END * vh], [0, 1]);
  const wallLift = useTransform(scrollY, [BLOG_IN_START * vh, BLOG_IN_END * vh], [0, 0.55]);
  const blogY = useTransform(
    scrollY,
    [BLOG_IN_START * vh, BLOG_IN_END * vh, BLOG_IN_END * vh + blogScroll],
    [reduceMotion ? 0 : 40, 0, -blogScroll],
  );

  return (
    <div className="relative" style={{ height: `calc(100svh + ${totalScroll}px)` }}>
      <motion.section
        className="sticky top-0 isolate h-[100svh] w-full overflow-hidden text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Backdrop />
        {/* Lightens the wall under the blog so the copy stays readable in the dark corner */}
        <motion.div className="pointer-events-none absolute inset-0 -z-10 bg-[#f1f0ed]" style={{ opacity: wallLift }} />

        {/* Title; on desktop it also carries the staircase captions (hidden on mobile) */}
        <motion.div className="absolute left-5 top-6 z-20 lg:left-10 lg:top-9 lg:w-max" style={{ opacity: textOpacity }}>
          <Title />
          <Captions className="stair hidden lg:block lg:absolute lg:left-2/3 lg:top-full lg:mt-[1.1em]" />
        </motion.div>

        {/* Mobile only — one-line description on its own full-width row under the title */}
        <motion.div className="absolute left-5 top-[11svh] z-20 w-[calc(100vw-2.5rem)] lg:hidden" style={{ opacity: textOpacity }}>
          <Description />
        </motion.div>

        {/* Tools — fade out flat, no direction */}
        <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ opacity: toolsOpacity }}>
          {/* Desktop — in the open wall space under the captions, between portrait and phone */}
          <Tools className="pointer-events-auto absolute left-[26vw] top-[47svh] hidden lg:block" />

          {/* Mobile — inside a thought bubble, tail aimed at the portrait below-left */}
          <ThoughtBubble className="pointer-events-auto absolute left-5 right-5 top-[20svh] lg:hidden" delay={1.4}>
            <Tools columns={5} tile="14.5vw" logo="9.4vw" gap="2.4vw" radius="3.8vw" delay={1.7} />
          </ThoughtBubble>
        </motion.div>

        {/* Phone — slides out to the right */}
        <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ x: phoneX, opacity: phoneOpacity }}>
          <div className="pointer-events-auto absolute bottom-[9svh] right-[5vw] h-[52svh] lg:bottom-auto lg:right-[7vw] lg:top-1/2 lg:h-[86svh] lg:-translate-y-1/2">
            <Phone className="h-full w-auto" />
          </div>
        </motion.div>

        {/* Portrait — slides out to the left */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ x: personX, opacity: personOpacity }}>
          <Person className="bottom-0 h-[58svh] lg:h-[84svh]" />
        </motion.div>

        {/* Blog — fades in over the wall, then scrolls inside the frame */}
        <motion.div className="absolute inset-x-0 top-0 z-30" style={{ opacity: blogOpacity, y: blogY }}>
          <div ref={blogRef}>
            <Blog />
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}