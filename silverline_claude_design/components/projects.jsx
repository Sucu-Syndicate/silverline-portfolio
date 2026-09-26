/* eslint-disable */
/* ============================================================
   Project section — 3 variants
   ============================================================ */

const PROJECTS = [
  {
    num: '01',
    name: 'Velvet',
    tagline: 'Personal task system',
    blurb: 'A task system that respects how I actually think — VARRO structure, Obsidian-native, equity-deal-funded build. The flagship.',
    stack: ['Next.js', 'Supabase', 'MDX', 'Obsidian'],
    year: '2026',
    role: 'Founder + Build',
  },
  {
    num: '02',
    name: 'Grill-Me',
    tagline: 'Decision interrogator',
    blurb: 'A structured /grill-me protocol. Drops you into a hard interview with yourself before you commit to a direction.',
    stack: ['TypeScript', 'CLI', 'Markdown'],
    year: '2026',
    role: 'Solo',
  },
  {
    num: '03',
    name: 'Open Memory MCP',
    tagline: 'Persistent memory for agents',
    blurb: 'An MCP server that gives Claude a persistent, structured memory across sessions. Open source, self-hostable.',
    stack: ['Rust', 'MCP', 'SQLite'],
    year: '2026',
    role: 'Maintainer',
  },
];

/* ─── Variant A · Asymmetric flagship + 2 satellites (default) ─── */
function ProjectsAsymmetric() {
  const [flag, ...rest] = PROJECTS;
  return (
    <div className="projects-grid">
      <article className="proj flagship reveal">
        <div className="proj-arrow">↗</div>
        <div className="proj-thumb">{flag.name.toLowerCase()} · cover</div>
        <div className="proj-meta">
          <span className="num">{flag.num}</span>
          <span className="dot" />
          <span>{flag.year}</span>
          <span className="dot" />
          <span>{flag.role}</span>
        </div>
        <h3>{flag.name}</h3>
        <p>{flag.blurb}</p>
        <div className="proj-stack">
          {flag.stack.map((s) => <span key={s}>{s}</span>)}
        </div>
      </article>
      {rest.map((p) => (
        <article key={p.num} className="proj reveal">
          <div className="proj-arrow">↗</div>
          <div className="proj-thumb">{p.name.toLowerCase()} · thumb</div>
          <div className="proj-meta">
            <span className="num">{p.num}</span>
            <span className="dot" />
            <span>{p.year}</span>
          </div>
          <h3>{p.name}</h3>
          <p>{p.blurb}</p>
          <div className="proj-stack">
            {p.stack.map((s) => <span key={s}>{s}</span>)}
          </div>
        </article>
      ))}
    </div>
  );
}

/* ─── Variant B · Stacked rows (newspaper / divider style) ─── */
function ProjectsRows() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {PROJECTS.map((p, i) => (
        <article
          key={p.num}
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: '64px 1fr 280px 80px',
            gap: 32,
            padding: '40px 0',
            borderTop: '1px solid var(--border)',
            borderBottom: i === PROJECTS.length - 1 ? '1px solid var(--border)' : 'none',
            alignItems: 'baseline',
            cursor: 'pointer',
            transition: 'background 0.3s ease, padding 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(93, 166, 122, 0.08)';
            e.currentTarget.style.borderLeftColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderLeftColor = 'transparent';
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.10em', color: 'var(--accent)',
          }}>{p.num}</span>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-structure)', fontWeight: 800,
              fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0,
            }}>{p.name}</h3>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 6,
              color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{p.tagline}</div>
          </div>
          <p style={{
            fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)',
            margin: 0, maxWidth: '38ch',
          }}>{p.blurb}</p>
          <span style={{
            fontFamily: 'var(--font-structure)', fontWeight: 400,
            fontSize: 22, color: 'var(--text-secondary)', textAlign: 'right',
          }}>↗</span>
        </article>
      ))}
    </div>
  );
}

/* ─── Variant C · Index card stack (horizontal, equal-density) ─── */
function ProjectsIndex() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 1,
      background: 'var(--border)',
      border: '1px solid var(--border)',
    }}>
      {PROJECTS.map((p) => (
        <article key={p.num} className="reveal" style={{
          background: 'var(--bg)',
          padding: '32px 28px',
          minHeight: 380,
          display: 'flex', flexDirection: 'column',
          gap: 14,
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--raised)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 0 var(--accent)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}>
            <span style={{ color: 'var(--accent)' }}>—— {p.num}</span>
            <span>{p.year}</span>
          </div>
          <div style={{
            width: '100%', height: 100,
            background: 'var(--code-surface)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-secondary)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{p.name.toLowerCase()} · cover</div>
          <h3 style={{
            fontFamily: 'var(--font-structure)', fontWeight: 800,
            fontSize: 24, letterSpacing: '-0.02em', margin: '4px 0 0',
          }}>{p.name}</h3>
          <p style={{
            fontSize: 13, lineHeight: 1.5,
            color: 'var(--text-secondary)', margin: 0, flex: 1,
          }}>{p.blurb}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p.stack.slice(0, 3).map((s) => (
              <span key={s} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
                background: 'var(--accent-bg)', color: 'var(--accent)',
                padding: '3px 7px', borderRadius: 2, letterSpacing: '0.04em',
              }}>{s}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

const PROJECT_VARIANTS = {
  asymmetric: ProjectsAsymmetric,
  rows: ProjectsRows,
  index: ProjectsIndex,
};

function ProjectsSection({ variant = 'asymmetric' }) {
  const Body = PROJECT_VARIANTS[variant] || ProjectsAsymmetric;
  return (
    <section className="section" id="projects" data-screen-label="02 Projects" style={{ background: 'var(--bg)' }}>
      <div className="section-head">
        <div>
          <div className="section-label">Selected work</div>
          <h2 className="section-title">Three I'm proud of,<br />more behind them.</h2>
        </div>
        <a href="/work" className="section-link">All projects →</a>
      </div>
      <Body />
    </section>
  );
}

window.ProjectsSection = ProjectsSection;
window.PROJECT_VARIANTS = PROJECT_VARIANTS;
