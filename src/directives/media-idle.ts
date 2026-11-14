import type { ClientDirective } from 'astro';

// client:media-idle="(query)": hydrate once the media query matches, the page has finished
// loading (fonts included) and the browser is idle. Decorative islands never compete with first
// paint, and screens that never match never download the island's JavaScript.
const mediaIdle: ClientDirective = (load, opts) => {
  const query = matchMedia(String(opts.value));

  const hydrate = () => {
    const run = async () => {
      const hydrateIsland = await load();
      await hydrateIsland();
    };
    const whenIdle = () => {
      if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 3000 });
      else setTimeout(run, 200);
    };
    if (document.readyState === 'complete') whenIdle();
    else addEventListener('load', whenIdle, { once: true });
  };

  if (query.matches) {
    hydrate();
    return;
  }
  const onChange = (event: MediaQueryListEvent) => {
    if (!event.matches) return;
    query.removeEventListener('change', onChange);
    hydrate();
  };
  query.addEventListener('change', onChange);
};

export default mediaIdle;
