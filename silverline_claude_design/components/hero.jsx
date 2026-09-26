/* eslint-disable */
/* ============================================================
   Hero — terminal as the hero. Streaming live output, full-height,
   monochrome (single light tint). New lines push in fast.
   ============================================================ */

const HERO_LOG_TICK_MIN = 700;   // ms · fastest interval between new lines
const HERO_LOG_TICK_MAX = 1800;  // ms · slowest interval
const HERO_LOG_MAX_LINES = 30;

const MARKERS = {
  commit: '◇',
  build:  '▸',
  ship:   '↑',
  think:  '~',
  note:   '·',
};

function pad(n) { return String(n).padStart(2, '0'); }
function nowTs() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function HeroLog() {
  const [lines, setLines] = React.useState(() => {
    // seed with a few so it doesn't start empty
    const src = (window.TERMINAL_LINES || []).slice();
    const seed = [];
    for (let i = 0; i < 8; i++) {
      const l = pickRandom(src);
      if (!l) break;
      seed.push({ ...l, ts: nowTs(), id: Math.random() + i, fresh: false });
    }
    return seed;
  });

  React.useEffect(() => {
    const src = window.TERMINAL_LINES || [];
    if (!src.length) return;
    let cancelled = false;
    let timer;

    const tick = () => {
      if (cancelled) return;
      setLines((prev) => {
        const pick = pickRandom(src);
        const next = [...prev.map((l) => ({ ...l, fresh: false })), {
          ...pick,
          ts: nowTs(),
          id: Math.random(),
          fresh: true,
        }];
        return next.length > HERO_LOG_MAX_LINES
          ? next.slice(next.length - HERO_LOG_MAX_LINES)
          : next;
      });
      const delay = HERO_LOG_TICK_MIN +
        Math.random() * (HERO_LOG_TICK_MAX - HERO_LOG_TICK_MIN);
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 600);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  return (
    <div className="hero-log" aria-hidden="true">
      <div className="hero-log-stream">
        {lines.map((l, i) => {
          const isLast = i === lines.length - 1;
          return (
            <div
              key={l.id}
              className={"line" + (l.fresh ? " fresh" : "") + (isLast ? " cursor" : "")}
            >
              <span className="ts">{l.ts}</span>
              <span className="marker">{MARKERS[l.tag] || '·'}</span>
              <span className="body">{l.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Variant A · Statement ───────── */
function HeroStatement() {
  return (
    <div className="hero-left">
      <div className="hero-eyebrow">Independent · Buenos Aires</div>
      <h1>
        Software that<br />
        <span className="green">earns its weight</span><span className="period">.</span>
      </h1>
      <p className="hero-sub">
        I write code, I write about code, and I'm trying to keep both
        worth reading. Most of what I make starts as a problem
        I had on a Tuesday.
      </p>
      <div className="hero-meta">
        <a href="#writing">Writing →</a>
        <a href="#projects">Work →</a>
        <a href="#about">About →</a>
      </div>
    </div>
  );
}

/* ───────── Variant B · Worklog ───────── */
function HeroWorklog() {
  return (
    <div className="hero-left">
      <div className="hero-eyebrow">Currently · shipping velvet v2</div>
      <h1>
        Notes from<br />
        a working <span className="green">desk</span><span className="period">.</span>
      </h1>
      <p className="hero-sub">
        Code, drafts, half-formed opinions. Mostly the second one.
        The good ones become posts. The rest become the next project.
      </p>
      <div className="hero-meta">
        <a href="#writing">Latest →</a>
        <a href="#now">/now →</a>
        <a href="mailto:hi@matheog.com">Say hi →</a>
      </div>
    </div>
  );
}

/* ───────── Variant C · Index / Masthead ───────── */
function HeroIndex() {
  return (
    <div className="hero-left">
      <div className="hero-eyebrow">Vol. 01 · Issue 14 · May 2026</div>
      <h1 style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>
        Matheo<br />
        <span className="green">Guevara</span><span className="period">.</span>
      </h1>
      <ol style={{
        listStyle: 'none', padding: 0, margin: '32px 0 0',
        display: 'grid', gap: 12, maxWidth: 360,
        fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em',
      }}>
        {[
          ['01', 'Writing', 'Long-form, twice a month'],
          ['02', 'Projects', 'Three flagships, more behind them'],
          ['03', 'Now',      'What this week looks like'],
        ].map(([n, label, sub]) => (
          <li key={n} style={{ display: 'grid', gridTemplateColumns: '32px 110px 1fr', gap: 12, paddingTop: 10, borderTop: '1px solid rgba(245,240,232,0.12)' }}>
            <span style={{ color: 'var(--green-dark)' }}>{n}</span>
            <span style={{ color: 'var(--hero-text)', fontWeight: 500 }}>{label}</span>
            <span style={{ color: 'rgba(245,240,232,0.5)' }}>{sub}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── Variant D · Stack / Quiet ───────── */
function HeroStack() {
  return (
    <div className="hero-left">
      <div className="hero-eyebrow">Online since '21 · Posting since '24</div>
      <h1>
        Things I've made<br />
        and things I've <span className="green">learned</span><span className="period">.</span>
      </h1>
      <p className="hero-sub">
        Mostly the second teaches me how to do the first better.
        This site is the receipts for both.
      </p>
      <div className="hero-meta">
        <a href="#projects">Receipts →</a>
        <a href="#writing">Writing →</a>
      </div>
    </div>
  );
}

/* ───────── Variant E · Single Question ───────── */
function HeroQuestion() {
  return (
    <div className="hero-left">
      <div className="hero-eyebrow">A site, not a feed</div>
      <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
        How do you make<br />
        software that <em className="green">lasts</em>?
      </h1>
      <p className="hero-sub" style={{ marginTop: 40 }}>
        I don't fully know yet. I'm writing about what I find.
        Every two weeks, sometimes more.
      </p>
      <div className="hero-meta">
        <a href="#writing">Read along →</a>
      </div>
    </div>
  );
}

const HERO_VARIANTS = {
  statement: HeroStatement,
  worklog:   HeroWorklog,
  index:     HeroIndex,
  stack:     HeroStack,
  question:  HeroQuestion,
};

function Hero({ variant = 'worklog', showCoords = false }) {
  const HeroBody = HERO_VARIANTS[variant] || HeroWorklog;
  return (
    <section className="hero" id="hero" data-screen-label="01 Hero">
      <div className="grain hero-grain" />
      <div className={"coords " + (showCoords ? "show" : "")} aria-hidden="true">
        <span className="lbl">lat</span> -34.6037 &nbsp;
        <span className="lbl">lng</span> -58.3816
      </div>
      <HeroLog />
      <div className="hero-inner">
        <HeroBody />
        {/* right column reserved by .hero-log absolute positioning */}
        <div />
      </div>
    </section>
  );
}

window.Hero = Hero;
window.HERO_VARIANTS = HERO_VARIANTS;
