/**
 * Checks every internal link in the built site.
 *
 *   npm run build && npm run check:links
 *
 * For each HTML file in dist/ it collects href and src values that point
 * inside the site and verifies that the target file exists and, when the
 * link has a #fragment, that the target page contains that id.
 * External links are listed but not requested.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(1);
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const pages = walk(dist).filter((file) => file.endsWith('.html'));
const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

/** Maps a site path to the file that serves it. */
function resolve(sitePath) {
  const clean = decodeURIComponent(sitePath.split('?')[0]);
  const target = path.join(dist, clean);
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  const index = path.join(target, 'index.html');
  if (fs.existsSync(index)) return index;
  return null;
}

const problems = [];
const external = new Set();
let checked = 0;

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const pageUrl = '/' + path.relative(dist, page).replace(/\\/g, '/').replace(/index\.html$/, '');
  const links = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));

  for (const link of links) {
    if (/^(mailto:|tel:|data:|javascript:)/.test(link)) continue;
    if (/^https?:\/\//.test(link)) {
      if (!link.startsWith('https://soroushjaberi.github.io')) external.add(link);
      continue;
    }
    checked++;
    const [rawPath, fragment] = link.split('#');
    const sitePath = rawPath === '' ? pageUrl : rawPath.startsWith('/') ? rawPath : path.posix.join(pageUrl, rawPath);
    const file = resolve(sitePath);
    if (!file) {
      problems.push(`${pageUrl}  →  ${link}  (no such file)`);
      continue;
    }
    if (fragment && file.endsWith('.html') && !idsOf(file).has(fragment)) {
      problems.push(`${pageUrl}  →  ${link}  (no element with id="${fragment}")`);
    }
  }
}

console.log(`${pages.length} pages, ${checked} internal links checked, ${external.size} distinct external links (not requested).`);
if (problems.length) {
  console.error(`\n${problems.length} broken link(s):`);
  for (const p of [...new Set(problems)]) console.error('  ' + p);
  process.exit(1);
}
console.log('No broken internal links.');
