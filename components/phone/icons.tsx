import type { SVGProps } from "react";

/** Minimal line icons for the reels chrome. All take the current text colour. */
const base = (p: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const HeartIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 21s-7.5-4.6-9.5-9.4C1.2 8.4 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.4C11.8 6.1 13.2 5 15.2 5c3.5 0 5.6 3.4 4.3 6.6C19.5 16.4 12 21 12 21z" />
  </svg>
);

export const CommentIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3.5c-4.9 0-8.5 3.4-8.5 7.7 0 2.2 1 4.1 2.6 5.5L5 20.5l4.3-1.6c.9.2 1.8.3 2.7.3 4.9 0 8.5-3.4 8.5-7.7S16.9 3.5 12 3.5z" />
  </svg>
);

export const ShareIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M21 3 3 10.5l7.5 2.5L13 21l8-18z" />
    <path d="M10.5 13 21 3" />
  </svg>
);

export const RepostIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export const MoreIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 8h14M5 12h14M5 16h14" />
  </svg>
);

export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SlidersIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
    <circle cx="15" cy="8" r="2" />
    <circle cx="9" cy="16" r="2" />
  </svg>
);

export const HomeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);

export const ReelsIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M3 8.5h18M8 3l3 5.5M14 3l3 5.5" />
    <path d="M10.5 12.5v5l4-2.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4-4" />
  </svg>
);

export const UserIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.5" r="4" />
    <path d="M4.5 20c1.2-3.5 4-5 7.5-5s6.3 1.5 7.5 5" />
  </svg>
);

export const VerifiedIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 1.5l2.6 2.2 3.4-.4 1.2 3.2 3 1.7-.9 3.3 1.5 3.1-2.7 2.1-.4 3.4-3.4.4L14.2 22 12 20.3 9.8 22l-2.1-2.5-3.4-.4-.4-3.4L1.2 13.6l1.5-3.1-.9-3.3 3-1.7 1.2-3.2 3.4.4z" />
    <path d="M8.2 12.3l2.5 2.5 5.1-5.3" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);