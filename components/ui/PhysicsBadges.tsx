'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import {
  siPython, siHtml5, siCss, siSelenium, siGithub,
  siReact, siNextdotjs, siTypescript, siFastapi, siSupabase,
  siTailwindcss, siPrisma, siAnthropic, siPosthog, siSentry,
  siTelegram, siRaspberrypi, siBinance, siClerk, siCloudflare,
  siMercadopago, siStripe, siGooglecloud, siObsidian,
  siModelcontextprotocol,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

// Custom SVG icons for brands not in simple-icons
// viewBox is stored alongside the path when it differs from 24×24
interface CustomIcon {
  path: string;
  viewBox?: string;  // defaults to "0 0 24 24" when omitted
}

const CUSTOM_ICONS: Record<string, CustomIcon> = {
  // Magnifying glass — BM25 is a text-retrieval ranking function
  bm25: {
    path: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  },
  // Real Azure DevOps icon — official path from commons.wikimedia.org/wiki/File:Azure_DevOps_icon.svg
  azureDevOps: {
    path: 'M34 6.375V27.0725L25.5 34.0425L12.325 29.24V34L4.86625 24.2462L26.605 25.9463V7.31L34 6.375ZM26.7538 7.41625L14.5562 0V4.86625L3.3575 8.16L0 12.4737V22.27L4.8025 24.395V11.8363L26.7538 7.41625Z',
    viewBox: '0 0 34 35',
  },
  // Real Power Automate icon — outer chevron shape from commons.wikimedia.org/wiki/File:Microsoft_Power_Automate.svg
  powerAutomate: {
    path: 'M61.2116 10C62.3496 10 63.4337 10.4847 64.1925 11.3328L94.6136 45.3328C95.9723 46.8514 95.9723 49.1486 94.6136 50.6672L64.1925 84.6672C63.4337 85.5153 62.3496 86 61.2116 86H3.94634C0.488777 86 -1.34012 81.9095 0.965366 79.3328L29 48L0.965366 16.6672C-1.34012 14.0905 0.488777 10 3.94634 10H61.2116Z',
    viewBox: '-2 8 100 80',
  },
  // Microsoft Lists — 2×2 grid tile (matches the icon's quadrant visual language)
  sharePoint: {
    path: 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z',
  },
  // ChromaDB — stylized cluster of 3 overlapping circles (vector embedding visualization)
  chromaDb: {
    path: 'M8.5 4a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm7 3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm-3.5 6a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z',
  },
};

interface BadgeDef {
  label: string;
  si?: SimpleIcon;
  custom?: CustomIcon;  // custom icon when si is unavailable
  bg: string;
  fg?: string;
}

// ── Known by heart — spawn on the LEFT ───────────────────────────────────────
const KNOWN: BadgeDef[] = [
  { label: 'Python',         si: siPython,                          bg: '#3776AB' },
  { label: 'HTML',           si: siHtml5,                           bg: '#E34F26' },
  { label: 'CSS',            si: siCss,                             bg: '#663399' },
  { label: 'Selenium',       si: siSelenium,                        bg: '#1b5e20' },
  { label: 'GitHub',         si: siGithub,                          bg: '#24292e' },
  { label: 'Power Automate', custom: CUSTOM_ICONS.powerAutomate,    bg: '#0050A4' },
  { label: 'Raspberry Pi',   si: siRaspberrypi,                     bg: '#8b0000' },
];

// ── Worked with — spawn on the RIGHT ─────────────────────────────────────────
const WORKED: BadgeDef[] = [
  { label: 'React',         si: siReact,                          bg: '#20232a', fg: '#61DAFB' },
  { label: 'Next.js',       si: siNextdotjs,                      bg: '#111' },
  { label: 'TypeScript',    si: siTypescript,                     bg: '#3178C6' },
  { label: 'FastAPI',       si: siFastapi,                        bg: '#005c55' },
  { label: 'Supabase',      si: siSupabase,                       bg: '#1a1a1a', fg: '#3FCF8E' },
  { label: 'Tailwind',      si: siTailwindcss,                    bg: '#0F172A', fg: '#38BDF8' },
  { label: 'Prisma',        si: siPrisma,                         bg: '#2D3748' },
  { label: 'Anthropic',     si: siAnthropic,                      bg: '#191919' },
  { label: 'Claude Code',   si: siAnthropic,                      bg: '#1c1710', fg: '#d97706' },
  { label: 'MCP Servers',   si: siModelcontextprotocol,           bg: '#191919' },
  { label: 'PostHog',       si: siPosthog,                        bg: '#F54E00' },
  { label: 'Sentry',        si: siSentry,                         bg: '#362D59' },
  { label: 'Azure DevOps',  custom: CUSTOM_ICONS.azureDevOps,     bg: '#0078D4' },
  { label: 'SharePoint',    custom: CUSTOM_ICONS.sharePoint,      bg: '#038387' },
  { label: 'ChromaDB',      custom: CUSTOM_ICONS.chromaDb,        bg: '#7c3aed' },
  { label: 'Obsidian',      si: siObsidian,                       bg: '#1e1e2e', fg: '#7c3aed' },
  { label: 'Vertex AI',     si: siGooglecloud,                    bg: '#1a73e8' },
  { label: 'BM25',          custom: CUSTOM_ICONS.bm25,            bg: '#374151' },
  { label: 'Telegram',      si: siTelegram,                       bg: '#0088CC' },
  { label: 'Binance',       si: siBinance,                        bg: '#1a1400', fg: '#F0B90B' },
  { label: 'Clerk',         si: siClerk,                          bg: '#4a3099' },
  { label: 'Cloudflare R2', si: siCloudflare,                     bg: '#b84a00', fg: '#fff' },
  { label: 'Mercado Pago',  si: siMercadopago,                    bg: '#007EB5' },
  { label: 'Stripe',        si: siStripe,                         bg: '#3d35a0' },
];

export default function PhysicsBadges() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgesRef    = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLDivElement>(null);
  const [started,  setStarted]  = useState(false);
  const [live,     setLive]     = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    setLive(false);
    setResetKey(k => k + 1);
  }, []);

  // Fire once the box scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); io.disconnect(); } },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !containerRef.current || !badgesRef.current || !canvasRef.current) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;

    // ── Engine ───────────────────────────────────────────────────────────────
    // positionIterations/velocityIterations: more solver passes → crisper collisions
    // enableSleeping: bodies that settle stop being simulated → no resting jitter, less CPU
    const engine = Engine.create({
      positionIterations:  10,
      velocityIterations:  8,
      constraintIterations: 4,
      enableSleeping:      true,
    });
    engine.gravity.y = 2.2;
    // Tighter penetration slop → collisions resolve immediately instead of
    // allowing a frame of visible overlap before correction kicks in
    (Matter.Resolver as any)._slop = 0.02;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const render = Render.create({
      element: canvasRef.current,
      engine,
      options: { width: W, height: H, background: 'transparent', wireframes: false },
    });

    // ── Static boundaries ─────────────────────────────────────────────────────
    const wall = {
      isStatic: true,
      render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
    };
    const floor   = Bodies.rectangle(W / 2,    H + 25,  W + 100, 50,     wall);
    const wallL   = Bodies.rectangle(-25,       H / 2,   50,      H * 3,  wall);
    const wallR   = Bodies.rectangle(W + 25,    H / 2,   50,      H * 3,  wall);
    const ceiling = Bodies.rectangle(W / 2,    -30,      W + 100, 50,     wall);
    World.add(engine.world, [floor, wallL, wallR]);

    // ── Measure ALL badges while they are still in-flow ───────────────────────
    // Must happen before any el.style.position = 'absolute' call
    const allEls    = [...badgesRef.current.querySelectorAll<HTMLElement>('[data-badge]')];
    const knownEls  = allEls.filter(el => el.dataset.badge === 'known');
    const workedEls = allEls.filter(el => el.dataset.badge === 'worked');

    type Sized = { el: HTMLElement; bw: number; bh: number };
    const knownSized:  Sized[] = knownEls .map(el => ({ el, bw: el.offsetWidth, bh: el.offsetHeight }));
    const workedSized: Sized[] = workedEls.map(el => ({ el, bw: el.offsetWidth, bh: el.offsetHeight }));

    // Pull all badges out of flow now — safe because we already have the sizes
    allEls.forEach(el => {
      el.style.position = 'absolute';
      el.style.margin   = '0';
      el.style.left     = '-9999px';  // park off-screen until physics picks them up
      el.style.top      = '-9999px';
    });
    setLive(true);

    // ── Body options ──────────────────────────────────────────────────────────
    const BODY_OPTS: Matter.IBodyDefinition = {
      restitution:    0.08,
      frictionAir:    0.012,
      friction:       0.6,
      frictionStatic: 0.8,   // stops resting bodies drifting sideways
      chamfer:        { radius: 4 } as any,  // rounds corners → no edge-on-edge micro-slides
      density:        0.002,
      sleepThreshold: 30,    // body sleeps quickly once it settles (default 60)
      render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
    };

    // ── Spawn helper — both waves land in the full-width center zone ──────────
    // xPad keeps badges away from the side walls so they don't stick to them
    const X_MIN = W * 0.06;
    const X_MAX = W * 0.94;

    function spawnWave(sized: Sized[], yTopOffset: number) {
      const cols = Math.max(1, Math.round((X_MAX - X_MIN) / 140));
      return sized.map(({ el, bw, bh }, i) => {
        const col  = i % cols;
        const row  = Math.floor(i / cols);
        const x    = X_MIN + (col + 0.5) * ((X_MAX - X_MIN) / cols) + (Math.random() - 0.5) * 16;
        const y    = yTopOffset - bh / 2 - row * (bh + 8) - Math.random() * 14;
        const body = Bodies.rectangle(x, y, bw, bh, BODY_OPTS);
        Matter.Body.setVelocity(body,        { x: (Math.random() - 0.5) * 1.5, y: 1.5 });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);
        return { el, body };
      });
    }

    // Wave 1 — KNOWN ("stack") drops immediately from just above the box
    const knownPairs = spawnWave(knownSized, -10);
    World.add(engine.world, knownPairs.map(p => p.body));

    // Wave 2 — WORKED drops 1.5 s later, spawning higher so it rains down onto
    // the already-settled KNOWN pile
    let workedPairs: { el: HTMLElement; body: Matter.Body }[] = [];
    const workedTimer = setTimeout(() => {
      workedPairs = spawnWave(workedSized, -180);
      World.add(engine.world, workedPairs.map(p => p.body));
    }, 1500);

    // Ceiling added after both waves have had time to settle
    const ceilingTimer = setTimeout(() => {
      World.add(engine.world, ceiling);
    }, 3200);

    // ── Mouse interaction ─────────────────────────────────────────────────────
    const mouse = Mouse.create(containerRef.current);
    const mc    = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    (render as any).mouse = mouse;
    World.add(engine.world, mc);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // ── RAF loop ──────────────────────────────────────────────────────────────
    // workedPairs is a let captured by reference — the loop sees the live array
    // the moment the 1.5 s timer fires and populates it
    let raf: number;
    const loop = () => {
      [...knownPairs, ...workedPairs].forEach(({ el, body }) => {
        // Keep bodies that are still above the box from flying upward
        if (body.position.y < 0 && body.velocity.y < 0) {
          Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 });
        }
        el.style.left      = `${body.position.x}px`;
        el.style.top       = `${body.position.y}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      clearTimeout(workedTimer);
      clearTimeout(ceilingTimer);
      cancelAnimationFrame(raf);
      Render.stop(render);
      Runner.stop(runner);
      render.canvas?.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
      // Restore inline styles so badges re-enter flow for remeasurement on reset
      allEls.forEach(el => {
        el.style.position  = '';
        el.style.margin    = '';
        el.style.left      = '';
        el.style.top       = '';
        el.style.transform = '';
      });
    };
  }, [started, resetKey]);

  const renderBadge = (b: BadgeDef, dataAttr: string) => {
    const path  = b.si?.path ?? b.custom?.path;
    const vb    = b.si ? '0 0 24 24' : (b.custom?.viewBox ?? '0 0 24 24');
    return (
      <div key={b.label} data-badge={dataAttr} className="phys-badge"
        style={{ '--b-bg': b.bg, '--b-fg': b.fg ?? '#fff' } as React.CSSProperties}>
        {path && (
          <svg className="phys-badge-icon" viewBox={vb} fill="currentColor" aria-hidden="true">
            <path d={path} />
          </svg>
        )}
        <span>{b.label}</span>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="physics-badges-box">

      {/* Corner labels */}
      <span className="phys-label phys-label--left">stack</span>
      <span className="phys-label phys-label--right">worked with</span>

      {/* Reset button — top-right */}
      <button
        className="phys-reset"
        onClick={handleReset}
        aria-label="Reset badges"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden="true">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </svg>
        reset
      </button>

      {/* Badge elements */}
      <div ref={badgesRef} className={`physics-badges-inner${live ? ' physics-badges-live' : ''}`}>
        {KNOWN.map((b)  => renderBadge(b, 'known'))}
        {WORKED.map((b) => renderBadge(b, 'worked'))}
      </div>

      {/* Matter.js canvas — behind badges */}
      <div ref={canvasRef} className="physics-badges-canvas" />
    </div>
  );
}
