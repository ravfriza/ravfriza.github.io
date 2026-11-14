// 180×180 home-screen icon for iOS (and Safari's fallback): the favicon dot, white on the dark theme background.
import type { APIRoute } from 'astro';
import sharp from 'sharp';

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#050505"/>
  <circle cx="90" cy="90" r="40" fill="#ffffff"/>
</svg>`;

export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(SVG)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
