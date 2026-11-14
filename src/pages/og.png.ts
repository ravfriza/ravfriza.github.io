// Link preview image (1200×630), rendered at build time in the site's monochrome style.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '../site';

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#050505';
const FG = '#ffffff';
const MUTED = '#a3a3a3';
const LINE = '#1e1e1e';

const font = (pkg: string, file: string) =>
  readFile(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

const line = (style: Record<string, unknown>) => el('div', { position: 'absolute', background: LINE, ...style });

export const GET: APIRoute = async () => {
  const [sans400, sans600, mono400] = await Promise.all([
    font('schibsted-grotesk', 'schibsted-grotesk-latin-400-normal.woff'),
    font('schibsted-grotesk', 'schibsted-grotesk-latin-600-normal.woff'),
    font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
  ]);

  const host = new URL(import.meta.env.SITE).host;

  const coin = el(
    'div',
    {
      position: 'absolute',
      right: 175,
      top: 235,
      width: 170,
      height: 170,
      borderRadius: 85,
      border: `3px solid ${FG}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    el(
      'div',
      {
        width: 146,
        height: 146,
        borderRadius: 73,
        border: `1.5px solid ${MUTED}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
      [
        el('div', { fontSize: 46, fontWeight: 600, color: FG, letterSpacing: -1 }, '1000'),
        el('div', { fontFamily: 'JetBrains Mono', fontSize: 13, color: MUTED, letterSpacing: 3 }, 'RUPIAH'),
      ],
    ),
  );

  const card = el(
    'div',
    {
      position: 'relative',
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      background: BG,
      color: FG,
      fontFamily: 'Schibsted Grotesk',
    },
    [
      // Same frame as the site: column side lines plus rules under the header and above the footer.
      line({ left: 150, top: 0, width: 1, height: HEIGHT }),
      line({ right: 150, top: 0, width: 1, height: HEIGHT }),
      line({ left: 0, top: 110, width: WIDTH, height: 1 }),
      line({ left: 0, top: 520, width: WIDTH, height: 1 }),
      el(
        'div',
        { position: 'absolute', left: 190, top: 38, fontFamily: 'JetBrains Mono', fontSize: 26 },
        site.handle,
      ),
      el(
        'div',
        { position: 'absolute', left: 190, top: 200, display: 'flex', flexDirection: 'column' },
        [
          el('div', { fontSize: 84, fontWeight: 600, letterSpacing: -2, lineHeight: 1.1 }, site.name),
          el(
            'div',
            { marginTop: 18, fontSize: 32, color: MUTED },
            'Fullstack developer at HotelMurah.com',
          ),
        ],
      ),
      coin,
      el(
        'div',
        {
          position: 'absolute',
          left: 190,
          top: 556,
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          color: MUTED,
        },
        host,
      ),
    ],
  );

  const svg = await satori(card, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Schibsted Grotesk', data: sans400, weight: 400, style: 'normal' },
      { name: 'Schibsted Grotesk', data: sans600, weight: 600, style: 'normal' },
      { name: 'JetBrains Mono', data: mono400, weight: 400, style: 'normal' },
    ],
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
