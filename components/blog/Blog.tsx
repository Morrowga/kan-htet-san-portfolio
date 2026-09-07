"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

/**
 * Posts, in order. Images live in /public/blog/. Add an object to add a post.
 */
export const POSTS: {
  title: string;
  intro: string;
  image1: string;
  body: string;
  image2: string;
}[] = [
  {
    title: "Hi, I'm Kan",
    intro:
      "Over the past 7 years, I've worked at the intersection of video editing, visual pacing, and digital storytelling. I help brands, studios, and creators transform raw footage into captivating visual experiences.",
    image1: "/blog/1.webp",
    body:
      "I stay at the forefront of post-production by blending traditional editing techniques with modern AI tools. Whether constructing high-converting social media campaigns, designing fluid visual transitions, or dialing in audio design, my goal is always the same: creating work that leaves a lasting impression.",
    image2: "/blog/2.webp",
  },
  {
    title: "Video Post-Production & Editing",
    intro:
      "Non-Linear Editing (NLE): high-efficiency assembly, multi-camera editing, dynamic pacing, and visual continuity across short-form and long-form formats. Audio Engineering & Cleanup: dialogue polish, noise reduction, vocal balancing, and sound design using Adobe Audition and Descript.",
    image1: "/blog/3.webp",
    body:
      "Color & Pacing: fundamental color grading, shot matching, and mood styling to align with brand identity. Primary tools: Adobe Premiere Pro, CapCut, Descript, Adobe Audition.",
    image2: "/blog/3.webp",
  },
  {
    title: "AI & Next-Gen Visual Workflows",
    intro:
      "AI Video Generation & FX: crafting prompt-driven visual effects, stylistic transitions, and generative footage using Kling AI and Flow AI.",
    image1: "/blog/3.webp",
    body:
      "Generative Visual Assets: designing and integrating custom AI imagery and JSON-based prompt structures for conceptual assets.",
    image2: "/blog/3.webp",
  },
  {
    title: "Strategy & Production",
    intro:
      "Content Strategy: concept development, scriptwriting, and promotional campaign structuring for short-form social formats — Instagram Reels, TikTok, YouTube Shorts.",
    image1: "/blog/3.webp",
    body:
      "Cinematography & Framing: practical understanding of camera setups, lens selection, lighting, and composition.",
    image2: "/blog/3.webp",
  },
];

const DRIVE_URL =
  "https://drive.google.com/drive/folders/14cjTsB-tRUb4ajiW_VlGpsGu-q-Ug7kx?usp=sharing";

/** Contact details, shown as one inline row under the "About Me" heading. */
const CONTACT = {
  email: "kanhtetsan@gmail.com",
  whatsappDisplay: "+660629295237",
  whatsappNumber: "660629295237", // digits only, for the wa.me link
  instagramHandle: "i__kan__do__it",
};

/**
 * Blog — one long column. Each post: title, intro, image, body, image.
 * Solid background so it can scroll up over the pinned hero.
 */
/**
 * Blog — one column. Each post: title, intro, image, body, image.
 * No background of its own: it's laid over the hero's wall inside the
 * pinned frame, so it takes whatever is behind it.
 *
 * Also owns a bottom-right CTA pill (jelly-glass, matching Tools) that
 * links to the Drive folder. It's hidden while the hero is in view and
 * appears once the page has scrolled into the blog content. It's rendered
 * through a portal to <body> so it stays truly fixed to the viewport even
 * though this component lives inside a transformed/pinned ancestor.
 */
export default function Blog() {
  const [showCTA, setShowCTA] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);

    const threshold = () => window.innerHeight * 0.5;

    const onScroll = () => {
      setShowCTA(window.scrollY > threshold());
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="mx-auto max-w-[44rem] px-5 pb-[12svh] pt-[14svh] text-black lg:px-0 lg:pt-[16svh]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <h2 className="font-sans text-5xl leading-none tracking-[0.02em] lg:text-7xl">About Me</h2>

      {/* Contact row — email, WhatsApp, Instagram, all inline */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-black/70 lg:text-base">
        
        <a href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-1.5 underline underline-offset-2 transition-colors hover:text-black"
        >
          <Mail size={16} strokeWidth={1.75} />
          <span>{CONTACT.email}</span>
        </a>
        
        <a href={`https://wa.me/${CONTACT.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 underline underline-offset-2 transition-colors hover:text-black"
        >
          <MessageCircle size={16} strokeWidth={1.75} />
          <span>{CONTACT.whatsappDisplay}</span>
        </a>
        
        <a href={`https://instagram.com/${CONTACT.instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 underline underline-offset-2 transition-colors hover:text-black"
        >
          <MessageCircle size={16} strokeWidth={1.75} />
          <span>{CONTACT.instagramHandle}</span>
        </a>
      </div>

      <div className="mt-14 space-y-24 lg:mt-8 lg:space-y-32">
        {POSTS.map((post) => (
          <article key={post.title} className="space-y-7">
            <h3 className="font-sans text-3xl leading-tight tracking-[0.02em] lg:text-4xl">{post.title}</h3>
            <p className="text-[1.05rem] leading-relaxed text-black/75 lg:text-lg">{post.intro}</p>
            <Figure src={post.image1} alt="" />
            <p className="text-[1.05rem] leading-relaxed text-black/75 lg:text-lg">{post.body}</p>
            <Figure src={post.image2} alt="" />
          </article>
        ))}
      </div>
    </div>
  );
}

function Figure({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      className="block aspect-[16/10] w-full rounded-2xl bg-black/10 object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]"
    />
  );
}