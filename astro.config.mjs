// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Fonts come from the @fontsource packages in node_modules, so builds need no
// network. Astro self-hosts the files, writes the @font-face rules, and
// generates metric-matched fallback fonts so text does not jump on load.
// Only the Latin subset is shipped; `unicodeRange` keeps the browser from
// fetching a file for characters it does not contain.
/** @type {[string, ...string[]]} */
const LATIN = [
  'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308',
  'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD',
];
const local = fontProviders.local();
/** @param {string} name @param {string} file */
const pkg = (name, file) => `./node_modules/@fontsource-variable/${name}/files/${file}`;

export default defineConfig({
  // Change this one line (and add public/CNAME) when moving to a custom domain.
  site: 'https://soroushjaberi.github.io',
  trailingSlash: 'always',
  // Keep HTML whitespace rules: this site is mostly prose, and the v7 default
  // ('jsx') strips spaces between inline elements.
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-dimmed' },
      defaultColor: false,
    },
  },
  fonts: [
    {
      // Display face for headlines. Carries the optical-size axis.
      provider: local,
      name: 'Bricolage Grotesque',
      cssVariable: '--font-bricolage',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: [pkg('bricolage-grotesque', 'bricolage-grotesque-latin-opsz-normal.woff2')],
            weight: '200 800',
            style: 'normal',
            unicodeRange: LATIN,
          },
        ],
      },
    },
    {
      // Display serif, italic only: the surname on the home page and the one
      // accent phrase in each headline. The face the previous site used.
      provider: local,
      name: 'Instrument Serif',
      cssVariable: '--font-instrument',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: ['./node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2'],
            weight: '400',
            style: 'italic',
            unicodeRange: LATIN,
          },
        ],
      },
    },
    {
      // Serif for long-form reading (case studies).
      // The browser fetches each file only on pages that use it.
      provider: local,
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: [pkg('newsreader', 'newsreader-latin-wght-normal.woff2')],
            weight: '200 800',
            style: 'normal',
            unicodeRange: LATIN,
          },
          {
            src: [pkg('newsreader', 'newsreader-latin-wght-italic.woff2')],
            weight: '200 800',
            style: 'italic',
            unicodeRange: LATIN,
          },
        ],
      },
    },
    {
      // Interface, labels and every number in a figure.
      provider: local,
      name: 'Hanken Grotesk',
      cssVariable: '--font-text',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: [pkg('hanken-grotesk', 'hanken-grotesk-latin-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
            unicodeRange: LATIN,
          },
        ],
      },
    },
    {
      // Code only. The browser fetches it on pages that contain code.
      provider: local,
      name: 'Atkinson Hyperlegible Mono',
      cssVariable: '--font-atkinson-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            src: [pkg('atkinson-hyperlegible-mono', 'atkinson-hyperlegible-mono-latin-wght-normal.woff2')],
            weight: '200 800',
            style: 'normal',
            unicodeRange: LATIN,
          },
        ],
      },
    },
  ],
});
