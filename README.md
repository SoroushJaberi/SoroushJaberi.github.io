# soroushjaberi.github.io

This is the source for my portfolio. I'm Soroush Jaberi — an AI researcher and data scientist
building machine learning systems for language, medical imaging, and document retrieval.

**Live at [soroushjaberi.github.io](https://soroushjaberi.github.io)**

## What's on the site

I wrote it as a walk through the work rather than a list of technologies. The areas I focus on —
natural language processing for low-resource settings like Persian, biomedical image segmentation,
retrieval-augmented generation, and applied computer vision — are each presented as a short case
study: the problem, the approach I took, and what actually came out of it. The rest covers my
academic background, the tools I reach for day to day, and a timeline of how I got here.

The contact section on the site has the ways to reach me.

## How it's built

| | |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org) (App Router), `output: 'export'` |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Motion | [framer-motion](https://www.framer.com/motion/), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Lenis](https://lenis.darkroom.engineering) |
| 3D | [three.js](https://threejs.org) via [react-three-fiber](https://r3f.docs.pmnd.rs) |
| Hosting | GitHub Pages, deployed by GitHub Actions |

A few decisions I'd rather explain than leave implicit:

**It's fully static.** The build produces plain HTML, CSS and JavaScript — no server, no database,
no API. For a portfolio that is the honest amount of infrastructure: nothing to keep running,
nothing to patch, and it loads from a CDN.

**The 3D hero pays for itself.** The landing scene is a WebGL neural field — nodes, edges, and
signals travelling between them — as an abstract stand-in for the systems I work on. three.js is by
far the heaviest dependency, so it is code-split and loaded only after the page is interactive: the
initial JavaScript payload stays around 198 kB, and the scene arrives afterwards. If the browser has
no WebGL, a CSS gradient takes its place and nothing breaks.

**The timeline is scroll-driven.** Scrolling down pins the section and carries the years from 2019
to 2026 sideways, then releases and the page continues. It behaves the same way on a phone, so
there's no separate horizontal gesture to discover.

**Motion is optional.** `prefers-reduced-motion` is respected throughout — it skips the intro,
freezes the marquee, and swaps the pinned timeline for a plain scrollable track. Every canvas and
WebGL visual has a static fallback, animation pauses off-screen and when the tab is hidden, and the
small type is kept above a readable contrast ratio rather than styled down into decoration.

## Running it locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into ./out
```

One caveat: don't run `npm run build` while `npm run dev` is going — they share the `.next`
directory and the dev server will start serving unstyled pages. Stop the dev server first.

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
installs with `npm ci`, builds the static export, and publishes `out/` to GitHub Pages. The Pages
source is set to GitHub Actions, and the workflow token can read the repository but not write
back to it.

The previous, hand-written version of this site is kept on the `legacy-site` branch.

## A note on reuse

The code is public and you're welcome to read it or borrow a technique. The writing, the
photographs and the design are mine, so please don't republish them as your own work.
