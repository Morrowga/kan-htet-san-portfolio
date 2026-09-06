/* eslint-disable @next/next/no-img-element */

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
    title: "How I cut a 40-second reel",
    intro:
      "Every reel starts as a two-minute mess. This is the pass where it turns into forty seconds that actually hold attention — what gets cut, what gets moved, and why the hook always ends up somewhere I didn't plan.",
    image1: "/blog/1.png",
    body:
      "The last ten seconds get the most work. They're the difference between a scroll-past and a rewatch, so I rebuild the ending three or four times before the timeline feels done.",
    image2: "/blog/1.png",
  },
  {
    title: "Shooting Chiang Mai at 6am",
    intro:
      "The light is gone by eight. Everything I shoot in the city happens in a two-hour window, so the day is planned backwards from sunrise: locations first, then how to move between them without wasting the glow.",
    image1: "/blog/2.png",
    body:
      "Most of it is handheld. A gimbal looks smoother, but the small shake is what makes a phone clip feel like you were there — and that feeling is the whole point.",
    image2: "/blog/2.png",
  },
  {
    title: "Where AI actually helps an edit",
    intro:
      "Not in the cut. Generation tools earn their place in the gaps — a missing establishing shot, a B-roll transition I couldn't film, a texture behind a title. The edit still has to carry the story on its own.",
    image1: "/blog/3.png",
    body:
      "The test is simple: if a generated shot is the thing people remember, it was doing too much. It should disappear into the piece.",
    image2: "/blog/3.png",
  },
];

/**
 * Blog — one long column. Each post: title, intro, image, body, image.
 * Solid background so it can scroll up over the pinned hero.
 */
/**
 * Blog — one column. Each post: title, intro, image, body, image.
 * No background of its own: it's laid over the hero's wall inside the
 * pinned frame, so it takes whatever is behind it.
 */
export default function Blog() {
  return (
    <div
      className="mx-auto max-w-[44rem] px-5 pb-[12svh] pt-[14svh] text-black lg:px-0 lg:pt-[16svh]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <h2 className="font-sans text-5xl leading-none tracking-[0.02em] lg:text-7xl">Blog</h2>

      <div className="mt-14 space-y-24 lg:mt-20 lg:space-y-32">
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