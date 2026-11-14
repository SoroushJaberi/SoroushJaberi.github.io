/**
 * Rasterises public/favicon.svg for the places that still need a PNG
 * (older browsers, iOS home screen). The SVG stays the single source.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function iconPng(size: number, padding = 0): Promise<Response> {
  const svg = await fs.readFile(path.join(process.cwd(), 'public', 'favicon.svg'));
  const inner = size - padding * 2;
  let image = sharp(svg, { density: Math.ceil((72 * inner) / 32) * 2 }).resize(inner, inner);
  if (padding > 0) {
    image = image.extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: '#15171c',
    });
  }
  const png = await image.png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800' },
  });
}
