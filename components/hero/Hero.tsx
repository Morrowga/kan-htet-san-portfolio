"use client";

import { motion } from "framer-motion";
import Person from "./Person";
import Title from "./Title";
import Backdrop from "./Backdrop";
import Captions from "./Captions";
import Description from "./Description";
import Tools from "./Tools";
import ThoughtBubble from "./ThoughtBubble";
import Phone from "@/components/phone/Phone";

/**
 * Hero — the first section, exactly one viewport tall, everything clipped
 * to it. Nothing here scrolls; the next section starts below the fold.
 *
 * Desktop (lg+): title top-left, captions staircasing down from it, tool
 *                tiles beneath; portrait bottom-left, half hidden past the
 *                left edge; phone with the reels feed on the right,
 *                vertically centred.
 * Mobile:        title; one-line description; a thought bubble of tool
 *                tiles whose tail points down at the portrait; then the
 *                portrait (bottom-left, half hidden) with the phone to its
 *                right, sitting a little higher.
 */
export default function Hero() {
  return (
    <motion.section
      className="relative isolate h-[100svh] w-full overflow-hidden text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Backdrop />

      {/* Title; on desktop it also carries the staircase captions (hidden on mobile) */}
      <div className="absolute left-5 top-6 z-20 lg:left-10 lg:top-9 lg:w-max">
        <Title />
        <Captions className="stair hidden lg:block lg:absolute lg:left-2/3 lg:top-full lg:mt-[1.1em]" />
      </div>

      {/* Mobile only — one-line description on its own full-width row under the title */}
      <Description className="absolute left-5 top-[11svh] z-20 w-[calc(100vw-2.5rem)] lg:hidden" />

      {/* Desktop — tools in the open wall space under the captions, between portrait and phone */}
      <Tools className="absolute left-[26vw] top-[47svh] z-20 hidden lg:block" />

      {/* Mobile only — tools inside a thought bubble, tail aimed at the portrait below-left */}
      <ThoughtBubble className="absolute left-5 right-5 top-[20svh] z-20 lg:hidden" delay={1.4}>
        <Tools columns={5} tile="14.5vw" logo="9.4vw" gap="2.4vw" radius="3.8vw" delay={1.7} />
      </ThoughtBubble>

      {/* Phone: right side, vertically centred on desktop; lower-right, raised off the floor, on mobile */}
      <div className="absolute bottom-[9svh] right-[5vw] z-10 h-[52svh] lg:bottom-auto lg:right-[7vw] lg:top-1/2 lg:h-[86svh] lg:-translate-y-1/2">
        <Phone className="h-full w-auto" />
      </div>

      {/* Portrait, 50% off-canvas at the left edge */}
      <Person className="bottom-0 h-[58svh] lg:h-[84svh]" />
    </motion.section>
  );
}