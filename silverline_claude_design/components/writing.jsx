/* eslint-disable */
/* ============================================================
   Writing — marquee w/ center slow zone + variants
   ============================================================ */

const POSTS = [
  { date: 'May 02, 2026', tag: 'process',     title: 'Lorem ipsum dolor sit amet, consectetur adipiscing.', blurb: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.' },
  { date: 'Apr 21, 2026', tag: 'architecture',title: 'Ut enim ad minim veniam, quis nostrud exercitation.',  blurb: 'Ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { date: 'Apr 08, 2026', tag: 'opinion',     title: 'Duis aute irure dolor in reprehenderit voluptate.',     blurb: 'Velit esse cillum dolore eu fugiat nulla pariatur.' },
  { date: 'Mar 27, 2026', tag: 'tooling',     title: 'Excepteur sint occaecat cupidatat non proident.',       blurb: 'Sunt in culpa qui officia deserunt mollit anim id est.' },
  { date: 'Mar 14, 2026', tag: 'AI',          title: 'Curabitur pretium tincidunt lacus, nulla gravida orci.', blurb: 'A odio. Integer at libero pellentesque, sodales arcu non.' },
  { date: 'Feb 28, 2026', tag: 'process',     title: 'Praesent aliquam metus libero, vitae pharetra orci.',   blurb: 'Phasellus ac est non ligula commodo elementum.' },
  { date: 'Feb 11, 2026', tag: 'argentina',   title: 'Aenean lacinia bibendum nulla sed consectetur.',        blurb: 'Donec id elit non mi porta gravida at eget metus.' },
];

/* ─── Variant A · Marquee w/ center slow zone (default) ─── */
function WritingMarquee() {
  const trackRef = React.useRef(null);
  const [paused, setPaused] = React.useState(false);
  const [focusIdx, setFocusIdx] = React.useState(null);
  const offsetRef = React.useRef(0);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (!paused) {
        const wrap = track.parentElement;
        const wrapRect = wrap.getBoundingClientRect();
        const center = wrapRect.left + wrapRect.width / 2;

        const cards = track.querySelectorAll('.post-card');
        let inFocus = -1;
        let nearestDist = Infinity;
        cards.forEach((card, i) => {
          const r = card.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const d = Math.abs(cx - center);
          if (d < nearestDist) { nearestDist = d; inFocus = i; }
        });
        const slowZone = 70;
        const halfCount = POSTS.length;
        const realFocus = inFocus % halfCount;
        const isSlow = nearestDist < slowZone;
        if (focusIdx !== realFocus) setFocusIdx(realFocus);

        const baseSpeed = 0.13;   // px/ms — fast cruise
        const slowSpeed = 0.018;  // px/ms — focus zone
        const speed = isSlow ? slowSpeed : baseSpeed;
        offsetRef.current -= dt * speed;

        // Wrap when first half scrolls out
        const halfWidth = track.scrollWidth / 2;
        if (-offsetRef.current >= halfWidth) offsetRef.current += halfWidth;
        track.style.transform = `translateX(${offsetRef.current}px)`;
      } else {
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, focusIdx]);

  // Duplicate for seamless loop
  const items = [...POSTS, ...POSTS];

  return (
    <div
      className="writing-track-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="writing-focus-line" />
      <div className="writing-track" ref={trackRef}>
        {items.map((p, i) => {
          const realIdx = i % POSTS.length;
          const inFocus = focusIdx === realIdx;
          return (
            <a key={i} href="#" className={"post-card" + (inFocus ? " in-focus" : "")}>
              <div className="post-meta">
                {p.date} <span className="accent">· {p.tag}</span>
              </div>
              <h4>{p.title}</h4>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Variant B · Vertical divider list (PostHog-ish) ─── */
function WritingList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {POSTS.slice(0, 5).map((p, i) => (
        <a key={i} href="#" className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: '110px 1fr 100px 30px',
          gap: 24, padding: '22px 0',
          borderTop: '1px solid var(--border)',
          borderBottom: i === 4 ? '1px solid var(--border)' : 'none',
          alignItems: 'baseline',
          transition: 'padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
          onMouseEnter={(e) => e.currentTarget.style.paddingLeft = '12px'}
          onMouseLeave={(e) => e.currentTarget.style.paddingLeft = '0'}
        >
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.06em', color: 'var(--text-secondary)',
          }}>{p.date}</span>
          <h4 style={{
            fontFamily: 'var(--font-structure)', fontWeight: 700,
            fontSize: 20, letterSpacing: '-0.015em', lineHeight: 1.25, margin: 0,
          }}>{p.title}</h4>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--accent)',
          }}>· {p.tag}</span>
          <span style={{
            fontFamily: 'var(--font-structure)', fontSize: 18,
            color: 'var(--text-secondary)', textAlign: 'right',
          }}>→</span>
        </a>
      ))}
    </div>
  );
}

/* ─── Variant C · Big-three editorial cards in a fast brake-easing marquee ─── */
function WritingBigThree({ speedMul = 4 }) {
  const trackRef = React.useRef(null);
  const offsetRef = React.useRef(0);
  const speedRef = React.useRef(0);          // current px/ms
  const targetRef = React.useRef(0.32 * speedMul);
  const blurRef = React.useRef(0);
  const wrapRef = React.useRef(null);
  const proximityRef = React.useRef(1);
  const cruiseRef = React.useRef(0.32 * speedMul);
  const PROX_RADIUS = 260;

  // Live-update cruise speed when the slider changes
  React.useEffect(() => {
    cruiseRef.current = 0.32 * speedMul;
  }, [speedMul]);

  React.useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!track || !wrap) return;
    let raf, last = performance.now();

    const tick = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      // proximity-modulated target speed
      targetRef.current = cruiseRef.current * proximityRef.current;
      // ease toward target — slow & jerky brake feel
      const easing = 0.06;
      speedRef.current += (targetRef.current - speedRef.current) * easing;
      if (Math.abs(speedRef.current) < 0.0008) speedRef.current = 0;

      offsetRef.current -= dt * speedRef.current;
      const halfWidth = track.scrollWidth / 2;
      if (-offsetRef.current >= halfWidth) offsetRef.current += halfWidth;
      if (offsetRef.current > 0) offsetRef.current -= halfWidth;

      // motion blur — barely-there, only during brake transitions
      const blurTarget = Math.min(Math.abs(speedRef.current) * 0.55, 1);
      blurRef.current += (blurTarget - blurRef.current) * 0.18;
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      track.style.filter = blurRef.current > 0.25 ? `blur(${blurRef.current.toFixed(2)}px)` : 'none';

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside) {
        proximityRef.current = 0;
        return;
      }
      // distance from cursor to nearest edge of the marquee box
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const dist = Math.hypot(dx, dy);
      const t = Math.min(dist / PROX_RADIUS, 1); // 0 at edge, 1 at radius
      // ease (smoothstep) so falloff feels natural
      proximityRef.current = t * t * (3 - 2 * t);
    };
    const onLeaveWindow = () => { proximityRef.current = 1; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeaveWindow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeaveWindow);
    };
  }, []);

  // Render each post twice for seamless loop
  const items = [...POSTS, ...POSTS];

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        cursor: 'pointer',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 48,
          willChange: 'transform, filter',
        }}
      >
        {items.map((p, i) => {
          const featured = (i % POSTS.length) === 0;
          return (
            <a key={i} href="#" style={{
              display: 'flex', flexDirection: 'column', gap: 14,
              padding: '24px 0',
              borderTop: '2px solid var(--text)',
              flexShrink: 0,
              width: featured ? 460 : 320,
              minHeight: 240,
              textDecoration: 'none',
              color: 'inherit',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.06em', color: 'var(--text-secondary)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>{p.date}</span>
                <span style={{ color: 'var(--accent)' }}>{p.tag}</span>
              </div>
              <h4 style={{
                fontFamily: 'var(--font-structure)', fontWeight: 700,
                fontSize: featured ? 30 : 22, letterSpacing: '-0.02em',
                lineHeight: 1.15, margin: 0,
                whiteSpace: 'normal',
              }}>{p.title}</h4>
              {featured && (
                <p style={{
                  fontFamily: 'var(--font-reading)',
                  fontSize: 15, lineHeight: 1.6,
                  color: 'var(--text-secondary)', margin: 0,
                }}>{p.blurb}</p>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

const WRITING_VARIANTS = {
  marquee: WritingMarquee,
  list: WritingList,
  bigthree: WritingBigThree,
};

function WritingSection({ variant = 'marquee', speedMul = 4 }) {
  const Body = WRITING_VARIANTS[variant] || WritingMarquee;
  return (
    <section className="section" id="writing" data-screen-label="03 Writing" style={{
      background: 'var(--surface)',
      maxWidth: 'none',
      padding: 'clamp(80px, 12vh, 140px) clamp(20px, 4vw, 56px)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="section-head">
          <div>
            <div className="section-label">From the desk</div>
            <h2 className="section-title">
              {variant === 'marquee' ? 'Catch one as it passes.' : 'Recent writing.'}
            </h2>
          </div>
          <a href="/blog" className="section-link">All posts →</a>
        </div>
        <Body speedMul={speedMul} />
      </div>
    </section>
  );
}

window.WritingSection = WritingSection;
window.WRITING_VARIANTS = WRITING_VARIANTS;
