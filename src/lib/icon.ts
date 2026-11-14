/**
 * The site icon: the "SJ" tile carried over from the previous version of the
 * site. One source image (src/assets/icons/sj.png, 1024 px) is resized at
 * build time into every size a browser or phone asks for.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = path.join(process.cwd(), 'src', 'assets', 'icons', 'sj.png');
const SIZE = 1024;
/** Corner radius of the tile in the source image, in source pixels. */
const RADIUS = 226;
/** Ground used where a platform does not allow transparency (iOS). */
const GROUND = '#1d2752';

const HEADERS = { 'Cache-Control': 'public, max-age=604800' };

let cleaned: Promise<Buffer> | undefined;

/** The source with everything outside the rounded tile made transparent. */
function tile(): Promise<Buffer> {
  cleaned ??= (async () => {
    const mask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="${RADIUS}" fill="#fff"/></svg>`,
    );
    return sharp(await fs.readFile(SOURCE))
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer();
  })();
  return cleaned;
}

/** A PNG of the icon. `square` fills the corners, for platforms that mask the icon themselves. */
export async function iconBuffer(size: number, square = false): Promise<Buffer> {
  let image = sharp(await tile()).resize(size, size, { kernel: 'lanczos3' });
  if (square) image = image.flatten({ background: GROUND });
  return image.png({ compressionLevel: 9 }).toBuffer();
}

export async function iconPng(size: number, square = false): Promise<Response> {
  const png = await iconBuffer(size, square);
  return new Response(new Uint8Array(png), { headers: { ...HEADERS, 'Content-Type': 'image/png' } });
}

/**
 * favicon.ico, for browsers and tools that ask for it by name. An .ico file
 * is a small directory followed by the images, which may be PNGs.
 */
export async function iconIco(sizes = [16, 32, 48]): Promise<Response> {
  const images = await Promise.all(sizes.map((size) => iconBuffer(size)));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach((image, i) => {
    const at = 6 + 16 * i;
    const size = sizes[i]!;
    header.writeUInt8(size >= 256 ? 0 : size, at); // width
    header.writeUInt8(size >= 256 ? 0 : size, at + 1); // height
    header.writeUInt8(0, at + 2); // palette
    header.writeUInt8(0, at + 3); // reserved
    header.writeUInt16LE(1, at + 4); // colour planes
    header.writeUInt16LE(32, at + 6); // bits per pixel
    header.writeUInt32LE(image.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += image.length;
  });

  const ico = Buffer.concat([header, ...images]);
  return new Response(new Uint8Array(ico), { headers: { ...HEADERS, 'Content-Type': 'image/x-icon' } });
}
