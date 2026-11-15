# ravfriza.github.io

Personal page of Daffa Ravfriza. Built with [Astro](https://astro.build), deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Edit content

- Name, handle, email, social links: `src/site.ts`
- Bio: `src/pages/index.astro`
- Uses list: the `groups` array at the top of `src/pages/uses.astro`

## Where things are

- `src/layouts/Base.astro`: header, footer, theme toggle, client-side navigation
- `src/components/MarginStatic.tsx`: the Braille background, built on the [asciicn](https://asciicn.dev) engine in `src/lib/ascii`
- `src/components/Coin.astro`: the coin flip and its sounds (`public/sounds`)
- `src/pages/og.png.ts`, `src/pages/apple-touch-icon.png.ts`: images rendered at build time

## Deploy

Every push to `main` deploys via `.github/workflows/deploy.yml`.
GitHub repo settings → Pages → Source must be **GitHub Actions**.
