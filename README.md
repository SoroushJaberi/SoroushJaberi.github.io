# soroushjaberi.github.io

The personal site of Soroush Jaberi, AI researcher and data scientist.
Live at **[soroushjaberi.github.io](https://soroushjaberi.github.io)**.

This is version 3 of the site. Versions 1 and 2 are kept, and any of the three can be put live with one
click (see [Switching versions](#switching-versions)).

```bash
npm install
npm run dev        # http://localhost:4321
npm run verify     # type-check, build, check every internal link
```

Node 22.22 or newer is required.

---

## The idea

The page introduces a person before it explains any one result.

It opens with an overview: name, role, one sentence, three facts, the ways onward, and a portrait. An
About section follows, then the areas I work in and the tools I use. Only after that does the page turn to
the work itself:

- **Selected work** is a reel. On a wide screen, scrolling down carries four panels sideways; on a phone
  it is a row to swipe. Each panel leads with what came out of the project.
- **Latest study** shows the knowledge-conflict study as 32,000 points, one per answer, that gather from a
  turning globe into four columns when the section comes into view. The number is exact: 8 runs ×
  4 conditions × 1,000 questions.
- **Research** lists papers with their status stated (a preprint is called a preprint).
- **Trajectory** is a timeline whose line fills as you scroll.
- **In frame** is a fanned deck of five photographs.
- **Working together** gives four entry points: PhD supervisors, employers, clients, researchers.

### Design language

- **Day theme by default, night theme on the switch.** Both use the same palette: warm paper and soft ink
  with two colours, teal (links, buttons, "true" in figures) and gold (emphasis, highlights, "wrong" in
  figures). The colours were chosen to sit well with the photographs.
- **Type:** Bricolage Grotesque for headlines, Hanken Grotesk for text and numbers, Newsreader for
  long-form reading and the italic accent phrase, Vazirmatn for the Persian name.
- **Menu:** the pattern of the previous site. Name at the left, a boxed bar of links in the middle on wide
  screens, and a "Menu" button that opens a compact numbered list over a blurred page.
- **Icons:** one set drawn in one style, in `src/components/Icon.astro`. The site mark is a point on an
  error bar.

## How it is built

| | |
| --- | --- |
| Framework | [Astro](https://astro.build) 7, static output. Pages are HTML at build time |
| Content | Markdown/MDX in content collections, validated by schemas |
| Styling | Plain CSS with custom properties. No CSS framework |
| Motion | Plain WebGL (no three.js), CSS, native view transitions, one small scroll script |
| Fonts | Self-hosted from `@fontsource` packages through Astro's Fonts API |
| Share images | Drawn at build time with `satori` + `sharp`, one per page |
| Hosting | GitHub Pages, deployed by GitHub Actions |

Decisions worth knowing:

- **Astro, not Next.js.** The site is content, so it ships HTML. Version 2 shipped about 198 kB of
  JavaScript before its 3D scene; this version ships about 10 kB in total.
- **No animation libraries.** The study figure is plain WebGL in `src/scripts/pointfield.ts`; the reel,
  timeline and photo deck share one scroll listener in `src/scripts/scrollfx.ts`.
- **Motion that every device can do.** Reveals animate only opacity and position. The study figure plays
  on its own clock when it comes into view, not on the page's scroll, and stops drawing once it has
  settled.
- **Everything degrades.** Without JavaScript or WebGL, or with "reduce motion" turned on, the study figure
  is plain bars with the same data, the reel is a swipeable row and the timeline is a list. Nothing is
  hidden waiting for a script.
- **One layout rule per component, not one per device.** The photo deck sizes itself from its own width
  (container query units), so the same rules fit a 320 px phone and a wide desktop.
- **GitHub Pages stays.** It is free, the address is on my CV, and a static site needs nothing more.
  For a custom domain, change `site` in `astro.config.mjs` and add `public/CNAME`.
- **No analytics, no cookies, no third-party requests.**

### Pinned versions

`astro` is pinned to 7.4.1 and `@astrojs/mdx` to 8.1.0 because newer patches require Node ≥ 22.23.4 and
this machine has 22.22.3. After updating Node, run `npx @astrojs/upgrade` and `npm run verify`.

Astro's `fontProviders.npm()` could not read local font files on Windows in 7.4.1, so `astro.config.mjs`
uses `fontProviders.local()` pointed at the same files in `node_modules`.

`.gitattributes` keeps LF line endings on every platform.

## Where things are

```
src/
  data/site.ts               name, role, links, navigation
  data/profile.ts            education, teaching, skills, interests, timeline (source: the CV)
  data/knowledge-conflict.ts every number in the study's figures, transcribed from the repository
  content/work/*.mdx         one file per project
  content/publications.yaml  papers and manuscripts
  content/writing/           articles (empty; see below)
  components/                Hero, WorkReel, PointField, Timeline, Frames, Header (+ menu), Icon, figures/…
  scripts/pointfield.ts      the 32,000-point study figure
  scripts/scrollfx.ts        reel, timeline line, photo deck, card tilt
  styles/global.css          tokens (colours, type, spacing) and shared styles
  pages/                     routes
public/                      CV PDFs, favicon
scripts/check-links.mjs      link checker used by `npm run verify`
```

## Updating the site

**Replace the CV.** Overwrite `public/Soroush-Jaberi-CV.pdf` and `public/cv/SoroushJaberiCV.pdf` (the
second keeps an old public link alive). Then update `src/data/profile.ts` to match.

**Change the opening.** The words are in `src/components/Hero.astro`; the photograph is
`src/assets/portraits/cafe.jpg` (replace the file, keep the name).

**Add a project.** Create `src/content/work/my-project.mdx`:

```mdx
---
title: My project
summary: One sentence saying what it is.
finding: One sentence saying what came out of it.
kind: research          # research | engineering | teaching
period: '2027'
year: 2027
tags: [NLP]
links:
  - label: Code
    href: https://github.com/…
stats:                   # optional, up to three, shown large on the home reel
  - value: '0.91'
    label: F1 on the test set
featured: true           # show it on the home page
order: 5
---

## The question

Write here. `<Figure>` and `<Note>` work without importing.
```

It gets a page at `/work/my-project/`, an entry in the lists, a share image and a sitemap entry. Set
`page: false` for a list-only entry that links to its repository.

**Add a publication.** Add an entry to `src/content/publications.yaml`. `status` is one of `published`,
`preprint`, `under-review`, `in-preparation`, `independent-study`.

**Start writing.** Add `src/content/writing/my-post.md` with `title`, `summary` and `published`. The
Writing page, the post, its share image, an RSS feed and a "Writing" menu entry all appear with the first
post, and not before.

**Change colours or type.** Edit the tokens at the top of `src/styles/global.css`. Each theme is one block.

**Change the photos.** Replace files in `src/assets/portraits/` (same names).

**Add an icon.** Add a path to the `icons` map in `src/components/Icon.astro`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: type-check, build, link check, publish. If any
step fails, the live site is left as it was.

### Switching versions

| Version | What | Branch |
| --- | --- | --- |
| **v3** (current) | This site (Astro) | `main` |
| v2 | Next.js site, August–November 2026 | `site-v2-nextjs` |
| v1 | The original hand-written site | `legacy-site` |

To put a different version live: on GitHub open **Actions → Deploy to GitHub Pages → Run workflow**,
choose the version, and run. It takes about a minute. To return, run it again with `current`.

Two things to know. A later push to `main` puts the current version live again. And nothing is ever
deleted by switching; each version stays on its branch.

## Checked before release

Run against the production build on 14 November 2026, in headless Edge:

| Check | Result |
| --- | --- |
| Type check (`astro check`) | 0 errors |
| Internal links | 334 checked, 0 broken |
| Layout at 11 widths, 320 px to 1920 px, all 10 pages | no horizontal overflow, nothing outside the screen, no clipped text |
| Accessibility (axe-core, WCAG 2.2 AA + best practice) | 0 violations on all 10 pages, day and night themes, desktop and phone |
| Layout shift (CLS) | 0 on every page |
| Reduced motion, and no WebGL | static layout in place |

Not measured: real-network performance on the deployed URL, and Safari and Firefox by hand. The code
avoids engine-specific features without a fallback, but those browsers were not opened.

## Known limits

- The study's follow-up numbers (three-run stability, the 128-token reasoning budget) come from the CV and
  are marked as work in progress; they are not yet in the study's public tables.
- The HVB-Persian scores are as reported in the preprint and the CV. The SSRN page could not be read
  automatically, so they were not cross-checked against the PDF.
- First-person copy was drafted from the CV, the previous site and the repositories' READMEs. It is mine
  to edit.
- There is no contact form, by design: a static site would need a third-party service for one.

## A note on reuse

The code is public and you are welcome to read it or borrow a technique. The writing, the photographs and
the design are mine, so please do not republish them as your own.
