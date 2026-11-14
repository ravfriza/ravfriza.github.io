declare module 'astro' {
  interface AstroClientDirectives {
    /** Hydrate when the media query matches and the browser is idle (src/directives/media-idle.ts). */
    'client:media-idle'?: string;
  }
}

export {};
