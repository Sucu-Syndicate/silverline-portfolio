// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE
'use client';

import { useEffect, useRef, useCallback } from 'react';

const ASCII_RAMP = ' .\'`^",:;Il!i><~+_-?][}{1)(|\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

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
  const srcCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef       = useRef<number | null>(null);
  const startRef     = useRef(performance.now());
  const sizeRef      = useRef({ w: 0, h: 0 });

  // Build the off-screen text canvas at the ASCII grid resolution
  const buildSrcCanvas = useCallback((cols: number, rows: number) => {
    const c = document.createElement('canvas');
    c.width  = cols;
    c.height = rows;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cols, rows);

    ctx.fillStyle  = '#fff';
    ctx.textAlign  = 'center';
    ctx.textBaseline = 'middle';

    // Auto-fit font size so text fills ~85% of the width
    let fs = rows * 0.65;
    ctx.font = `900 ${fs}px "Archivo Black", "Archivo", Arial, sans-serif`;
    while (ctx.measureText(text).width > cols * 0.9 && fs > 2) {
      fs -= 0.5;
      ctx.font = `900 ${fs}px "Archivo Black", "Archivo", Arial, sans-serif`;
    }
    ctx.fillText(text, cols / 2, rows / 2);

    srcCanvasRef.current = c;
  }, [text]);

  const draw = useCallback(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw  = container.clientWidth;
    const ch  = container.clientHeight;
    if (!cw || !ch) return;

    // Each ASCII "pixel" covers (asciiFontSize × asciiFontSize) display pixels
    const cols = Math.max(1, Math.floor(cw / (asciiFontSize * 0.6)));
    const rows = Math.max(1, Math.floor(ch / asciiFontSize));

    // Rebuild src canvas when dimensions change
    if (sizeRef.current.w !== cols || sizeRef.current.h !== rows) {
      sizeRef.current = { w: cols, h: rows };
      buildSrcCanvas(cols, rows);
    }

    // Sync display canvas resolution
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width  = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width  = `${cw}px`;
      canvas.style.height = `${ch}px`;
    }

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const src    = srcCanvasRef.current;
    if (!src) { ctx.setTransform(1, 0, 0, 1, 0, 0); return; }

    const pixels = src.getContext('2d')!.getImageData(0, 0, cols, rows).data;
    const t      = enableWaves ? (performance.now() - startRef.current) / 1000 : 0;

    const cellW = cw / cols;
    const cellH = ch / rows;

    ctx.font         = `${asciiFontSize}px "Geist Mono", "Courier New", monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle    = textColor;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = (y * cols + x) * 4;
        let b = pixels[idx] / 255; // brightness (grayscale — r=g=b)

        if (enableWaves && b > 0.05) {
          const wave = Math.sin((x * 0.25 + y * 0.08 - t * 3) * Math.PI) * 0.18;
          b = Math.max(0, Math.min(1, b + wave));
        }

        if (b < 0.04) continue; // skip empty background

        const ci   = Math.floor(b * (ASCII_RAMP.length - 1));
        const char = ASCII_RAMP[ci];
        ctx.fillText(char, x * cellW, y * cellH);
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [text, asciiFontSize, textColor, enableWaves, buildSrcCanvas]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Inject canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;position:absolute;inset:0;';
    container.style.position = 'relative';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    // Initial draw
    startRef.current = performance.now();
    draw();

    // RAF loop for waves, single draw otherwise
    let live = true;
    const loop = () => {
      if (!live) return;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    if (enableWaves) rafRef.current = requestAnimationFrame(loop);

    // Resize
    const ro = new ResizeObserver(() => {
      sizeRef.current = { w: 0, h: 0 }; // force rebuild
      if (!enableWaves) draw();
    });
    ro.observe(container);

    return () => {
      live = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (canvas.parentElement === container) container.removeChild(canvas);
      canvasRef.current    = null;
      srcCanvasRef.current = null;
    };
  }, [draw, enableWaves]);

  return (
    <div
      ref={containerRef}
      className={`ascii-text ${className}`.trim()}
      style={{ display: 'block', overflow: 'hidden', ...style }}
    />
  );
}
