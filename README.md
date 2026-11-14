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

It opens with an overview: name, role, one sentence, three facts, the ways onward, and a portrait, with a
neural network turning slowly behind the portrait. The whole opening is in view when the page loads, on
any screen, with nothing to scroll for. An About section follows, then the areas I work in and the tools I
use. Only after that does the page turn to the work itself:

- **Selected work** is a reel. The section holds still while scrolling down carries four panels sideways,
  on phones and tablets as well as desktops. The panels also move with a sideways swipe, a mouse drag, the
  two arrow buttons and the keyboard. Each panel leads with what came out of the project.
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
- **Type:** Bricolage Grotesque for headlines, Hanken Grotesk for text and numbers, Instrument Serif
  italic for the surname and for the one accent phrase in each headline (the face the previous site used),
  Newsreader for long-form reading, Vazirmatn for the Persian name.
- **The name:** its letters arrive one after another when the page loads, and each lifts and changes
  colour under the mouse.
- **The network:** layers of nodes in space, with signals travelling forward from layer to layer the way
  activations do. A node lights when a signal reaches it; a connection stays warm for a moment after one
  has passed.
- **Reading line:** a thin strip across the top of the window fills as the page is scrolled, on every
  page.
- **Menu:** the pattern of the previous site. Name at the left, a boxed bar of links in the middle on wide
  screens, and a "Menu" button that opens a compact numbered list over a blurred page.
- **Icons:** one set drawn in one style, in `src/components/Icon.astro`. The tab icon is the "SJ" tile
  from the previous site.

## How it is built

| | |
| --- | --- |
| Framework | [Astro](https://astro.build) 7, static output. Pages are HTML at build time |
| Content | Markdown/MDX in content collections, validated by schemas |
| Styling | Plain CSS with custom properties. No CSS framework |
| Motion | Plain WebGL and 2D canvas (no three.js), CSS, native view transitions, one small scroll script |
| Fonts | Self-hosted from `@fontsource` packages through Astro's Fonts API |
| Share images | Drawn at build time with `satori` + `sharp`, one per page |
| Hosting | GitHub Pages, deployed by GitHub Actions |

Decisions worth knowing:

- **Astro, not Next.js.** The site is content, so it ships HTML. Version 2 shipped about 198 kB of
  JavaScript before its 3D scene; this version ships about 22 kB in total (9 kB compressed).
- **No animation libraries.** The study figure is plain WebGL in `src/scripts/pointfield.ts`; the network
  behind the portrait is a 2D canvas in `src/scripts/neuralfield.ts`; the reel, timeline and photo deck
  share one scroll listener in `src/scripts/scrollfx.ts`.
- **The opening is sized from the window's height as well as its width.** Every size in it takes the
  smaller of a width-based and a height-based value, and it has three layouts: narrow (portrait beside the
  name), wide (text left, portrait right) and short (a phone held sideways, a low window). That is what
  keeps all of it in the first screen.
- **Motion that every device can do.** Reveals animate only opacity and position. The study figure plays
  on its own clock when it comes into view, not on the page's scroll, and stops drawing once it has
  settled.
- **The reel measures instead of guessing the device.** It pins itself only if a panel really fits in one
  screen; on short screens (a phone held sideways, for instance) it becomes an ordinary sideways-scrolling
  row with the same arrow buttons.
- **Everything degrades.** Without JavaScript or WebGL, or with "reduce motion" turned on, the study figure
  is plain bars with the same data, the reel is a swipeable row and the timeline is a list. The network
  is decoration: it draws one still frame under "reduce motion" and is simply absent without JavaScript.
  Nothing is hidden waiting for a script.
- **One layout rule per component, not one per device.** The photo deck sizes itself from its own width
  (container query units), so the same rules fit a 320 px phone and a wide desktop.
- **GitHub Pages stays.** It is free, the address is on my CV, and a static site needs nothing more.
  For a custom domain, change `site` in `astro.config.mjs` and add `public/CNAME`.
- **No analytics, no cookies, no third-party requests.**

### Browser support

Tested in three engines: Chromium (Chrome, Edge, Samsung Internet, Opera), Firefox, and WebKit (Safari on
macOS and iOS). The site relies on CSS cascade layers, so the practical floor is browsers released from
March 2022: Chrome and Edge 99, Firefox 97, Safari 15.4. Newer features have fallbacks: `color-mix()`,
container query units, `:has()`, `overflow: clip`, small-viewport units, `<dialog>` and view transitions
all degrade to something that still works.

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
  assets/portraits/          the five photographs
  assets/icons/sj.png        the tab icon's source image
  components/                Hero, WorkReel, PointField, Timeline, Frames, ContactPhoto, Header (+ menu), Icon, figures/…
  scripts/neuralfield.ts     the network behind the portrait
  scripts/pointfield.ts      the 32,000-point study figure
  scripts/scrollfx.ts        reel, timeline line, photo deck, card tilt
  styles/global.css          tokens (colours, type, spacing) and shared styles
  lib/icon.ts                resizes the tab icon into every size a browser asks for
  pages/                     routes
public/                      CV PDFs
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

**Change the photos.** Replace files in `src/assets/portraits/` (same names). `cafe.jpg` opens the home
page, `formal.jpg` is on the About page, `sun.jpg` sits beside the contact invitation, and all five are in
the photo deck.

**Add an icon.** Add a path to the `icons` map in `src/components/Icon.astro`.

**Change the tab icon.** Replace `src/assets/icons/sj.png` with a square image of 512 px or more. If its
corners are rounded differently, set `RADIUS` in `src/lib/icon.ts`.

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

Run against the production build on 14 November 2026:

| Check | Result |
| --- | --- |
| Type check (`astro check`) | 0 errors |
| Internal links | 365 checked, 0 broken |
| Layout at 13 widths, 280 px to 2560 px, all 10 pages | no horizontal overflow, nothing outside the screen, no clipped text |
| The opening fits the first screen: Chromium, Firefox and WebKit × 56 window sizes (phones upright and sideways, tablets, laptops with every toolbar open, desktops, ultrawide) | every part of it is inside the window on load, nothing overlaps, nothing runs off the side |
| Chromium, Firefox and WebKit × 8 device sizes (fold, phones, phone sideways, tablets, laptop, desktop) | all pages load without script errors; reel, arrows, mouse drag, menu, theme switch, study figure, photo deck and the prediction widget all work |
| Real touch gestures on the reel (Chromium, 5 sizes) | sideways swipe moves the panels, vertical swipe scrolls the page, tap opens the case study |
| Accessibility (axe-core, WCAG 2.2 AA + best practice) | 0 violations on all 10 pages, day and night themes, desktop and phone |
| Layout shift (CLS) | 0 on every page |
| Reduced motion, and no WebGL | static layout in place |

Not covered: real devices. The WebKit runs use Playwright's WebKit build on Windows, which shares Safari's
engine but is not Safari on an iPhone; touch gestures were sent to Chromium only, because the other two
engines cannot be driven by touch in this setup. Real-network performance on the deployed URL was not
measured.

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
