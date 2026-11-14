# ravfriza.github.io

Personal page of Daffa Ravfriza. Built with [Astro](https://astro.build), deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Edit content

- Bio, links, "now" line, time zone: `src/site.ts` and `src/pages/index.astro`

## Deploy

Every push to `main` deploys via `.github/workflows/deploy.yml`.
GitHub repo settings → Pages → Source must be **GitHub Actions**.
