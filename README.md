# creator-portfolio-hero

Full-viewport hero: grayscale portrait on the left, a hand-stacked wall of 16 CRT televisions on the right, each looping a gif/video behind a transparent screen hole.

```
npm install
npm run dev
```

## Assets
- `public/person.png` — portrait (grayscale toggle: `PERSON_GRAYSCALE` in `components/hero/Person.tsx`)
- `public/tv/tv-kind-1.png … tv-kind-6.png` — frame PNGs, screen holes already punched
- `public/tv-gifs/placeholder-1.gif … placeholder-14.gif` — swap for real gifs/mp4s (set `contentType: "video"` in the config for mp4/webm)

## Layout
Everything about the wall lives in `TV_INSTANCES` in `components/tv/TvStack.tsx`. Adding a TV is appending one object to that array — see the comment block at the top of that file.
