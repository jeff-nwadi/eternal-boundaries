"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Canvas2D reimplementation of the 21st.dev "mine" ASCII effect, configured for
 * the `contour` render mode over a procedural "silk" field (params supplied by
 * the user). It is NOT a WebGL shader: the silk field is evaluated on the CPU
 * per grid cell, contour iso-lines are drawn per cell, then post-effects
 * (bloom glow, vignette, scanlines, film grain) are layered on.
 *
 * Tuned "clean and sleek" for a CTA backdrop — moderate opacity, glow toward
 * the edges, so overlaid copy stays readable. Pauses off-screen and honours
 * prefers-reduced-motion (renders a single static frame).
 */

// ---- Config (from the supplied JSON, tempered for a CTA background) ----
const CELL = 12; // cellSize
const LEVELS = 11; // contour bands
const TINT: [number, number, number] = [0, 255, 102]; // #00ff66
const COVERAGE = 0.96;
const CONTRAST = 1.35; // contrast 115 → line crispness
const EDGE_EMPHASIS = 0.4; // thins the iso-lines
const LINE_ALPHA = 0.5; // overall restraint for the CTA
const BLOOM = 0.55;
const VIGNETTE = 0.42;
const SCANLINES = 0.16;
const GRAIN = 0.05;
const FLICKER = 0.6; // animIntensity
const DRIFT = 0.32; // silk field drift speed
const FLICKER_RATE = 9; // per-cell twinkle frequency

function hash(i: number, j: number, k: number): number {
  let n = (i * 374761393 + j * 668265263 + k * 362437) | 0;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967296;
}

/** Layered flow field → a smooth "silk"-like value in [0,1]. */
function silk(x: number, y: number, t: number): number {
  let v = Math.sin(x * 1.1 + t);
  v += Math.sin(y * 1.4 - t * 0.8);
  v += Math.sin((x + y) * 0.8 + Math.sin(x * 0.5 - t * 0.5) * 1.6);
  v += Math.sin(Math.hypot(x - 3, y - 2) * 1.05 - t * 0.6);
  return v / 4; // ~[-1,1]
}

function makeNoiseTile(): HTMLCanvasElement {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const g = (Math.random() * 255) | 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = g;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

export function AsciiContourBackground({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const line = document.createElement("canvas");
    const lineCtx = line.getContext("2d")!;
    const noise = makeNoiseTile();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsFilter = "filter" in ctx;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      for (const c of [canvas, line]) {
        c.width = Math.max(1, Math.floor(width * dpr));
        c.height = Math.max(1, Math.floor(height * dpr));
      }
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lineCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(container);

    const drawFrame = (t: number) => {
      if (width === 0 || height === 0) return;
      const s = 0.026; // spatial frequency (zoom)
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      const d = 0.6; // gradient sample delta (domain units)
      const bucket = Math.floor(t * FLICKER_RATE);

      // --- contour iso-lines into the offscreen line layer ---
      lineCtx.clearRect(0, 0, width, height);
      lineCtx.lineCap = "round";
      lineCtx.lineWidth = 1.1;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          if (hash(i, j, 7) > COVERAGE) continue;
          const cx = i * CELL + CELL / 2;
          const cy = j * CELL + CELL / 2;
          const x = cx * s;
          const y = cy * s;

          const v = silk(x, y, t);
          // gradient → iso-line direction (perpendicular to gradient)
          const gx = silk(x + d * s, y, t) - silk(x - d * s, y, t);
          const gy = silk(x, y + d * s, t) - silk(x, y - d * s, t);
          const gl = Math.hypot(gx, gy) || 1e-4;
          const dirx = -gy / gl;
          const diry = gx / gl;

          // proximity to a contour level → line strength
          const phase = (v * 0.5 + 0.5) * LEVELS;
          let edge = 1 - Math.abs((phase - Math.floor(phase)) - 0.5) * 2;
          edge = Math.pow(edge, 1 + EDGE_EMPHASIS * 4);
          edge = Math.min(1, Math.max(0, (edge - 0.5) * CONTRAST + 0.5));
          if (edge <= 0.02) continue;

          // flicker twinkle
          const fl = 1 - FLICKER * hash(i, j, bucket);
          const alpha = edge * LINE_ALPHA * fl;
          if (alpha <= 0.02) continue;

          const half = CELL * 0.62;
          lineCtx.strokeStyle = `rgba(${TINT[0]},${TINT[1]},${TINT[2]},${alpha.toFixed(3)})`;
          lineCtx.beginPath();
          lineCtx.moveTo(cx - dirx * half, cy - diry * half);
          lineCtx.lineTo(cx + dirx * half, cy + diry * half);
          lineCtx.stroke();
        }
      }

      // --- composite onto the visible canvas ---
      ctx.clearRect(0, 0, width, height);

      // bloom glow (blurred copy under the sharp lines)
      if (supportsFilter && BLOOM > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = BLOOM;
        ctx.filter = "blur(6px)";
        ctx.drawImage(line, 0, 0, width, height);
        ctx.restore();
      }
      ctx.drawImage(line, 0, 0, width, height);

      // scanlines
      if (SCANLINES > 0) {
        ctx.save();
        ctx.globalAlpha = SCANLINES;
        ctx.fillStyle = "#000";
        for (let yy = 0; yy < height; yy += 3) ctx.fillRect(0, yy, width, 1);
        ctx.restore();
      }

      // film grain (offset noise tile)
      if (GRAIN > 0) {
        ctx.save();
        ctx.globalAlpha = GRAIN;
        ctx.globalCompositeOperation = "overlay";
        const ox = -(Math.random() * 128) | 0;
        const oy = -(Math.random() * 128) | 0;
        for (let yy = oy; yy < height; yy += 128)
          for (let xx = ox; xx < width; xx += 128)
            ctx.drawImage(noise, xx, yy);
        ctx.restore();
      }

      // vignette
      if (VIGNETTE > 0) {
        const g = ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.2,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.72
        );
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, `rgba(0,0,0,${VIGNETTE})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }
    };

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      if (visible) drawFrame(((now - start) / 1000) * DRIFT);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      drawFrame(12); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("pointer-events-none absolute inset-0", className)}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
    </div>
  );
}
