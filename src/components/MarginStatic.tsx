"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import type { AsciiHandle, CharsetName } from "@/lib/ascii";
import { AsciiShader } from "@/lib/ascii/shader";

/*
 * Drifting contour lines of a slow noise field, drawn in Braille in the empty side
 * margins. Thin lines give Braille detail at sample scale, so it reads as glyphs,
 * not grey fog. The tone fades to 0 toward the content column, and lines thicken
 * near the pointer.
 */
const FIELD = /* glsl */ `
float staticHeight(vec2 p, float t) {
  vec2 q = p * 1.4 + vec2(u_seed * 17.0, 0.0);
  float warp = snoise(q * 0.6 + vec2(t * 0.02, -t * 0.015));
  return 0.5
    + 0.35 * snoise(q + vec2(0.0, t * 0.03) + warp * 0.6)
    + 0.15 * snoise(q * 2.1 - vec2(t * 0.025, 0.0));
}

float staticLine(float h, float hx, float hy, float count, float width) {
  float v = h * count;
  float offset = abs(fract(v + 0.5) - 0.5);
  float perSample = max(length(vec2(hx - h, hy - h)) * count, 1e-4);
  float d = offset / perSample;
  return (1.0 - smoothstep(width * 0.5 - 0.5, width * 0.5 + 0.5, d)) * (1.0 - smoothstep(0.06, 0.1, offset));
}

float field(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float px = 1.0 / res.y;

  vec2 ptr = vec2(u_pointer.x * aspect, u_pointer.y);
  vec2 dp = p - ptr;
  float near = exp(-dot(dp, dp) * 14.0) * u_pointer.z;

  float h = staticHeight(p, t);
  float hx = staticHeight(p + vec2(px, 0.0), t);
  float hy = staticHeight(p + vec2(0.0, px), t);
  float lines = staticLine(h, hx, hy, staticCount, mix(1.4, 3.2, near));

  // Thin out toward the content column. Braille lights a dot only above a threshold, so a
  // smooth tone fade would end in a hard edge; drop dots at random instead (stable per sample,
  // no time in the hash, so nothing flickers).
  float gap = max(staticColumn.x - uv.x, uv.x - staticColumn.y);
  float side = smoothstep(0.0, staticFade, gap);
  float keep = step(hash21(floor(uv * res)) + 0.001, side); // +0.001: nothing at side == 0

  return lines * keep;
}
`;

export interface MarginStaticProps {
  /** Element whose box stays clear of glyphs (the content column). */
  clearSelector?: string;
  /** Contour lines across the full height. */
  count?: number;
  /** How far into each margin (fraction of viewport width) the fade runs. */
  fade?: number;
  /** Glyph colour: a token name or CSS colour. Defaults to a faint theme ink. */
  ink?: string;
  charset?: CharsetName;
  cell?: number;
  speed?: number;
  animate?: boolean;
  seed?: number;
  handle?: RefObject<AsciiHandle | null>;
  className?: string;
}

export function MarginStatic({
  clearSelector = ".page",
  count = 9,
  fade = 0.1,
  ink = "color-mix(in srgb, var(--fg) 24%, var(--bg))",
  charset = "braille",
  cell,
  speed = 0.5,
  animate,
  seed = 3,
  handle,
  className,
}: MarginStaticProps) {
  // Content column edges in uv x (0 = left of the viewport, 1 = right).
  const [column, setColumn] = useState<[number, number]>([0.3, 0.7]);

  useEffect(() => {
    const target = document.querySelector(clearSelector);
    if (!target) return;
    const measure = () => {
      const rect = target.getBoundingClientRect();
      setColumn([rect.left / innerWidth, rect.right / innerWidth]);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      removeEventListener("resize", measure);
    };
  }, [clearSelector]);

  return (
    <AsciiShader
      field={FIELD}
      uniforms={{ staticCount: count, staticColumn: column, staticFade: fade }}
      charset={charset}
      colorMode="mono"
      ink={ink}
      background="transparent"
      cell={cell}
      speed={speed}
      animate={animate}
      stillTime={14}
      fps={30}
      seed={seed}
      handle={handle}
      className={className}
    />
  );
}
