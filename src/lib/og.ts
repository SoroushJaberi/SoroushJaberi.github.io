/**
 * Share images (Open Graph / Twitter cards), drawn at build time.
 * Satori lays out the card and converts text to outlines; sharp turns the
 * resulting SVG into a PNG. No browser, no network.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '@/data/site';

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = '#0b0b0d';
const INK = '#f1ece2';
const INK_2 = '#bcb8b0';
const INK_3 = '#908d87';
const RULE = 'rgba(241, 236, 226, 0.2)';
const MARK = '#ff5a2c';

type Weight = 400 | 500 | 600 | 700;
type FontSpec = { name: string; pkg: string; file: string; weight: Weight };

const FONTS: FontSpec[] = [
  { name: 'Bricolage', pkg: 'bricolage-grotesque', file: 'bricolage-grotesque-latin-600-normal.woff', weight: 600 },
  { name: 'Bricolage', pkg: 'bricolage-grotesque', file: 'bricolage-grotesque-latin-700-normal.woff', weight: 700 },
  {
    name: 'Atkinson',
    pkg: 'atkinson-hyperlegible-next',
    file: 'atkinson-hyperlegible-next-latin-400-normal.woff',
    weight: 400,
  },
  {
    name: 'Atkinson',
    pkg: 'atkinson-hyperlegible-next',
    file: 'atkinson-hyperlegible-next-latin-600-normal.woff',
    weight: 600,
  },
];

let fontCache: Promise<{ name: string; data: Buffer; weight: Weight; style: 'normal' }[]> | undefined;

function loadFonts() {
  fontCache ??= Promise.all(
    FONTS.map(async (font) => ({
      name: font.name,
      weight: font.weight,
      style: 'normal' as const,
      data: await fs.readFile(path.join(process.cwd(), 'node_modules', '@fontsource', font.pkg, 'files', font.file)),
    })),
  );
  return fontCache;
}

/* A tiny element helper so the card reads like markup without needing JSX. */
type Node = { type: string; props: Record<string, unknown> };
type Child = Node | string | false | null | undefined;
const h = (type: string, style: Record<string, unknown>, ...children: Child[]): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.filter(Boolean) },
});

/** The site mark (a dot on an error bar), drawn from boxes. */
function mark(scale = 1): Node {
  const s = (n: number) => n * scale;
  return h(
    'div',
    { position: 'relative', width: s(44), height: s(26), alignItems: 'center' },
    h('div', { position: 'absolute', left: 0, top: s(12), width: s(44), height: s(3), background: INK, borderRadius: s(2) }),
    h('div', { position: 'absolute', left: 0, top: 0, width: s(3), height: s(26), background: INK, borderRadius: s(2) }),
    h('div', { position: 'absolute', left: s(41), top: 0, width: s(3), height: s(26), background: INK, borderRadius: s(2) }),
    h('div', {
      position: 'absolute',
      left: s(20),
      top: s(4),
      width: s(18),
      height: s(18),
      borderRadius: s(9),
      background: MARK,
      border: `${s(3)}px solid ${PAPER}`,
    }),
  );
}

/** A decorative strip of intervals: the look of the site's dot plots. */
function intervals(): Node {
  const rows: [number, number, number][] = [
    [46, 62, 54.7],
    [42, 57, 49.3],
    [56, 67, 61.8],
    [52, 63, 57.6],
    [61, 70, 65.9],
  ];
  const W = 300;
  const x = (v: number) => ((v - 36) / 40) * W;
  return h(
    'div',
    { position: 'relative', width: W, height: 150, flexDirection: 'column' },
    h('div', {
      position: 'absolute',
      left: x(49.3),
      top: 0,
      width: x(67.8) - x(49.3),
      height: 150,
      background: 'rgba(255, 90, 44, 0.2)',
    }),
    ...rows.map(([a, b, v], i) =>
      h(
        'div',
        { position: 'absolute', left: 0, top: 12 + i * 28, width: W, height: 16 },
        h('div', { position: 'absolute', left: x(a), top: 7, width: x(b) - x(a), height: 2, background: INK_3 }),
        h('div', {
          position: 'absolute',
          left: x(v) - 8,
          top: 0,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: i % 2 ? PAPER : MARK,
          border: `3px solid ${MARK}`,
        }),
      ),
    ),
  );
}

export interface OgCard {
  /** Small line above the title, e.g. "Research · 2026". */
  eyebrow?: string;
  title: string;
  text?: string;
}

export async function renderOg(card: OgCard): Promise<Buffer> {
  const long = card.title.length > 42;
  const tree = h(
    'div',
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px 56px',
      background: PAPER,
      color: INK,
      fontFamily: 'Atkinson',
    },
    // top: mark + name
    h(
      'div',
      { alignItems: 'center', justifyContent: 'space-between' },
      h(
        'div',
        { alignItems: 'center', gap: 18 },
        mark(1),
        h('div', { fontFamily: 'Bricolage', fontWeight: 600, fontSize: 34, letterSpacing: -1 }, site.name),
      ),
      card.eyebrow ? h('div', { fontSize: 24, fontWeight: 600, color: INK_3 }, card.eyebrow) : null,
    ),
    // middle: title + text, with the intervals motif on the right
    h(
      'div',
      { alignItems: 'flex-end', justifyContent: 'space-between', gap: 48 },
      h(
        'div',
        { flexDirection: 'column', gap: 22, maxWidth: 760 },
        h(
          'div',
          {
            fontFamily: 'Bricolage',
            fontWeight: 700,
            fontSize: long ? 62 : 84,
            lineHeight: 1,
            letterSpacing: long ? -2.4 : -3.6,
          },
          card.title,
        ),
        card.text
          ? h('div', { fontSize: 27, lineHeight: 1.38, color: INK_2 }, clamp(card.text, long ? 150 : 180))
          : null,
      ),
      intervals(),
    ),
    // bottom: rule + url
    h(
      'div',
      {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 22,
        borderTop: `2px solid ${RULE}`,
        fontSize: 23,
        color: INK_3,
      },
      h('div', { fontWeight: 600, color: INK_2 }, site.role),
      h('div', {}, 'soroushjaberi.github.io'),
    ),
  );

  const svg = await satori(tree as never, { ...OG_SIZE, fonts: await loadFonts() });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…';
}
