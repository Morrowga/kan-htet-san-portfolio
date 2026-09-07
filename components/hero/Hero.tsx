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
import ProjectButton from "./ProjectButton";
import Phone from "@/components/phone/Phone";
import Blog from "@/components/blog/Blog";

const EXIT_END = 0.55;
const BLOG_IN_START = 0.6;
const BLOG_IN_END = 0.85;

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const blogRef = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(800);
  const [blogH, setBlogH] = useState(0);

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

  const blogScroll = Math.max(0, blogH - vh);
  const totalScroll = BLOG_IN_END * vh + blogScroll;

  const { scrollY } = useScroll();

  const personX = useTransform(scrollY, [0, EXIT_END * vh], ["0%", reduceMotion ? "0%" : "-45%"]);
  const personOpacity = useTransform(scrollY, [0, EXIT_END * vh * 0.9], [1, 0]);
  const phoneX = useTransform(scrollY, [0, EXIT_END * vh], ["0%", reduceMotion ? "0%" : "45%"]);
  const phoneOpacity = useTransform(scrollY, [0, EXIT_END * vh * 0.9], [1, 0]);
  const toolsOpacity = useTransform(scrollY, [0, EXIT_END * vh * 0.45], [1, 0]);
  const textOpacity = useTransform(scrollY, [EXIT_END * vh * 0.3, EXIT_END * vh], [1, 0]);

  const blogOpacity = useTransform(scrollY, [BLOG_IN_START * vh, BLOG_IN_END * vh], [0, 1]);
  // Only let the Blog layer receive clicks once it's actually visible —
  // otherwise, while opacity is 0, it silently sits on top of the hero UI
  // (Tools, Project button, etc.) at z-30 and swallows every click.
  const blogPointerEvents = useTransform(blogOpacity, (v) => (v > 0.05 ? "auto" : "none"));
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
        <motion.div className="pointer-events-none absolute inset-0 -z-10 bg-[#f1f0ed]" style={{ opacity: wallLift }} />

        <motion.div className="absolute left-5 top-6 z-20 lg:left-10 lg:top-9 lg:w-max" style={{ opacity: textOpacity }}>
          <Title />
          <Captions className="stair hidden lg:block lg:absolute lg:left-2/3 lg:top-full lg:mt-[1.1em]" />
        </motion.div>

        <motion.div className="absolute left-5 top-[11svh] z-20 w-[calc(100vw-2.5rem)] lg:hidden" style={{ opacity: textOpacity }}>
          <Description />
        </motion.div>

        <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ opacity: toolsOpacity }}>
          <div className="absolute left-[26vw] top-[47svh] hidden w-max lg:block">
            <div className="relative">
              <Tools className="pointer-events-auto" />
              <div className="absolute inset-x-0 right-20 top-full mt-4 flex justify-center">
                <ProjectButton />
              </div>
            </div>
          </div>

          <ThoughtBubble className="pointer-events-auto absolute left-5 right-5 top-[20svh] lg:hidden" delay={1.4}>
            <Tools columns={5} tile="14.5vw" logo="9.4vw" gap="2.4vw" radius="3.8vw" delay={1.7} />
          </ThoughtBubble>
        </motion.div>

        <motion.div className="pointer-events-none fixed inset-x-5 bottom-6 z-40 lg:hidden" style={{ opacity: toolsOpacity }}>
          <ProjectButton
            className="pointer-events-auto"
            width="100%"
            fontSize="4vw"
            padding="3.2vw 0"
            radius="6vw"
            delay={1.6}
          />
        </motion.div>

        <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ x: phoneX, opacity: phoneOpacity }}>
          <div className="pointer-events-auto absolute bottom-[9svh] right-[5vw] h-[52svh] lg:bottom-auto lg:right-[7vw] lg:top-1/2 lg:h-[86svh] lg:-translate-y-1/2">
            <Phone className="h-full w-auto" />
          </div>
        </motion.div>

        <motion.div className="pointer-events-none absolute inset-0" style={{ x: personX, opacity: personOpacity }}>
          <Person className="bottom-0 h-[58svh] lg:h-[84svh]" />
        </motion.div>

        <motion.div
          className="absolute inset-x-0 top-0 z-30"
          style={{ opacity: blogOpacity, y: blogY, pointerEvents: blogPointerEvents }}
        >
          <div ref={blogRef}>
            <Blog />
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}