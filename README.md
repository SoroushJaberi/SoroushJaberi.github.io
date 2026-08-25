# soroushjaberi.github.io

Personal portfolio of **Soroush Jaberi** — AI Researcher & Data Scientist.

Live at **https://soroushjaberi.github.io**

## Stack

- [Next.js 14](https://nextjs.org) (App Router) with `output: 'export'` — fully static, no server
- [Tailwind CSS v4](https://tailwindcss.com)
- [framer-motion](https://www.framer.com/motion/) + [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for scroll storytelling
- [three.js](https://threejs.org) / [react-three-fiber](https://r3f.docs.pmnd.rs) for the WebGL "neural field" hero (lazy-loaded, with a CSS fallback)
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling

Motion respects `prefers-reduced-motion` throughout, and every WebGL/Canvas visual has a static fallback.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```

> Don't run `npm run build` while `npm run dev` is running — they share `.next`.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the
static export and publishes `out/` to GitHub Pages. Repo **Settings → Pages → Source** must be set to
**GitHub Actions**.

The previous version of this site is preserved on the `legacy-site` branch.
