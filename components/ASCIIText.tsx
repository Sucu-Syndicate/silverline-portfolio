// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE
'use client';

import { useEffect, useRef, useCallback } from 'react';

// Dense ramp: space = transparent, @ = brightest
const ASCII_RAMP = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

export interface ASCIITextProps {
  text: string;
  enableWaves?: boolean;
  asciiFontSize?: number;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ASCIIText({
  text,
  enableWaves = true,
  asciiFontSize = 8,
  textColor = '#E8E6DD',
  className = '',
  style,
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const srcRef       = useRef<HTMLCanvasElement | null>(null);
  const srcSizeRef   = useRef({ cols: 0, rows: 0 });
  const rafRef       = useRef<number | null>(null);
  const startRef     = useRef(performance.now());

  // Build the source (text) canvas at ASCII-grid resolution.
  // Each pixel in the source maps to one ASCII cell in the output.
  const buildSrc = useCallback((cols: number, rows: number) => {
    const c = document.createElement('canvas');
    c.width  = cols;
    c.height = rows;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cols, rows);
    ctx.fillStyle    = '#fff';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    // Start at full-row-height and shrink until text fits 92% of width
    let fs = rows;
    ctx.font = `900 ${fs}px Arial, sans-serif`;
    while (ctx.measureText(text).width > cols * 0.92 && fs > 2) {
      fs -= 0.5;
      ctx.font = `900 ${fs}px Arial, sans-serif`;
    }
    ctx.fillText(text, cols / 2, rows / 2);

    srcRef.current = c;
    srcSizeRef.current = { cols, rows };
  }, [text]);

  const draw = useCallback(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw  = container.clientWidth;
    const ch  = container.clientHeight;
    if (!cw || !ch) return;

    // Each cell: asciiFontSize tall, ~0.6× wide (monospace aspect ratio)
    const cellH = asciiFontSize;
    const cellW = asciiFontSize * 0.6;
    const cols  = Math.max(1, Math.floor(cw / cellW));
    const rows  = Math.max(1, Math.floor(ch / cellH));

    // Rebuild source canvas when grid dimensions change
    if (srcSizeRef.current.cols !== cols || srcSizeRef.current.rows !== rows) {
      buildSrc(cols, rows);
    }

    // Sync display canvas pixel size
    const pw = Math.round(cw * dpr);
    const ph = Math.round(ch * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width  = pw;
      canvas.height = ph;
      canvas.style.width  = `${cw}px`;
      canvas.style.height = `${ch}px`;
    }

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, pw, ph);
    ctx.save();
    ctx.scale(dpr, dpr);

    const src = srcRef.current;
    if (!src) { ctx.restore(); return; }

    const pixels = src.getContext('2d')!.getImageData(0, 0, cols, rows).data;
    const t = enableWaves ? (performance.now() - startRef.current) / 1000 : 0;

    ctx.font         = `${cellH}px "Geist Mono", "Courier New", monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle    = textColor;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = (y * cols + x) * 4;
        let b = pixels[idx] / 255; // r channel = brightness (grayscale image)

        if (b < 0.04) continue; // skip background

        if (enableWaves && b > 0.05) {
          const wave = Math.sin((x * 0.25 + y * 0.08 - t * 3) * Math.PI) * 0.18;
          b = Math.max(0, Math.min(1, b + wave));
        }

        const ci   = Math.floor(b * (ASCII_RAMP.length - 1));
        ctx.fillText(ASCII_RAMP[ci], x * cellW, y * cellH);
      }
    }

    ctx.restore();
  }, [text, asciiFontSize, textColor, enableWaves, buildSrc]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;position:absolute;inset:0;';
    canvasRef.current = canvas;
    container.appendChild(canvas);

    startRef.current = performance.now();

    // Initial draw — retry next frame if container still has no size
    const tryDraw = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) {
        requestAnimationFrame(tryDraw);
        return;
      }
      draw();
      if (enableWaves) {
        let live = true;
        const loop = () => {
          if (!live) return;
          draw();
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => { live = false; };
      }
    };
    tryDraw();

    // Resize observer rebuilds on layout change
    const ro = new ResizeObserver(() => {
      srcSizeRef.current = { cols: 0, rows: 0 }; // force rebuild
      if (!enableWaves) draw();
    });
    ro.observe(container);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (canvas.parentElement === container) container.removeChild(canvas);
      canvasRef.current = null;
      srcRef.current    = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run when props change
  useEffect(() => {
    srcSizeRef.current = { cols: 0, rows: 0 };
    if (!enableWaves) draw();
  }, [text, asciiFontSize, textColor, enableWaves, draw]);

  return (
    <div
      ref={containerRef}
      className={`ascii-text ${className}`.trim()}
      style={{ position: 'relative', display: 'block', overflow: 'hidden', ...style }}
    />
  );
}
