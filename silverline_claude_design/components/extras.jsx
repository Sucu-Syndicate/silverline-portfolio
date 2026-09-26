/* eslint-disable */
/* ============================================================
   /now teaser + Footer + Konami changelog + Cursor trail
   ============================================================ */

function NowTeaser() {
  const hour = new Date().getHours();
  const greeting =
    hour < 6  ? 'late · the quiet hours' :
    hour < 12 ? 'morning · coffee on' :
    hour < 18 ? 'afternoon · in flow' :
    hour < 22 ? 'evening · winding down' :
                'late · the quiet hours';

  return (
    <section className="section" id="now" data-screen-label="04 Now" style={{ paddingTop: 0, background: 'var(--bg)' }}>
      <a href="/now" className="now-block reveal">
        <div className="now-label">/now</div>
        <div>
          <div className="now-text">
            Drafting v2 of the portfolio system. Reading Kleppmann.
            Half a chapter behind on Velvet's task graph. Always Argentina time.
          </div>
        </div>
        <div className="now-greet">{greeting} →</div>
      </a>
    </section>
  );
}

function Footer() {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  return (
    <footer className="footer" data-screen-label="05 Footer">
      <div className="footer-inner">
        <h2 className="footer-mark">matheog<span style={{ color: 'var(--accent)' }}>.</span></h2>
        <div className="footer-meta">
          <div><a href="mailto:hi@matheog.com">hi@matheog.com</a></div>
          <div><a href="https://github.com/matheog" target="_blank" rel="noreferrer">github / matheog</a></div>
          <div><a href="https://linkedin.com/in/matheog" target="_blank" rel="noreferrer">linkedin / matheog</a></div>
          <div style={{ marginTop: 8, opacity: 0.6 }}>{ts}</div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 · Matheo Guevara</span>
        <span>Buenos Aires · -34.6037, -58.3816</span>
      </div>
    </footer>
  );
}

/* ─── Konami changelog easter egg ─── */
function ChangelogOverlay({ open, onClose }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const entries = [
    ['2026.05.06', 'Hero terminal ships. Five variants live behind a tweak panel.'],
    ['2026.05.05', 'Design system v2 locked. Two-register typography. Forest green earned its place.'],
    ['2026.05.02', 'Killed Playfair. Killed gold. Erased the April direction.'],
    ['2026.04.28', 'Velvet VARRO scaffolds wired into Obsidian.'],
    ['2026.04.18', 'matheog.com domain secured ($10).'],
    ['2026.04.10', '/grill-me protocol formalized. First clean checkpoint.'],
  ];
  return (
    <div className={"changelog" + (open ? " open" : "")} onClick={onClose}>
      <div className="changelog-card" onClick={(e) => e.stopPropagation()}>
        <h2>~/changelog</h2>
        <p className="note">↑↑↓↓←→←→ba — you found it. these are the receipts.</p>
        {entries.map(([d, t]) => (
          <div key={d} className="cl-row">
            <span className="cl-date">{d}</span>
            <span>{t}</span>
          </div>
        ))}
        <div className="close-hint">esc to close</div>
      </div>
    </div>
  );
}

/* ─── Easter egg controller (cursor trail + coords reveal + konami) ─── */
function EasterEggs({ enabled, onChangelogToggle, onCoordsToggle }) {
  const dotsRef = React.useRef([]);

  // Cursor dot trail in hero only
  React.useEffect(() => {
    if (!enabled) return;
    const N = 6;
    const dots = [];
    for (let i = 0; i < N; i++) {
      const d = document.createElement('div');
      d.className = 'cursor-dot';
      d.style.opacity = String(0.55 - i * 0.08);
      d.style.transform = `translate(-100px, -100px) scale(${1 - i * 0.12})`;
      document.body.appendChild(d);
      dots.push({ el: d, x: -100, y: -100 });
    }
    dotsRef.current = dots;

    let mx = -100, my = -100, inHero = false;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      const heroEl = document.getElementById('hero');
      if (!heroEl) return;
      const r = heroEl.getBoundingClientRect();
      inHero = my >= r.top && my <= r.bottom;
      onCoordsToggle(inHero && my < r.top + 200);
      dots.forEach(d => d.el.style.opacity = inHero ? d.el.style.opacity : '0');
    };
    let raf;
    const tick = () => {
      let px = mx, py = my;
      dots.forEach((d) => {
        d.x += (px - d.x) * 0.35;
        d.y += (py - d.y) * 0.35;
        d.el.style.transform = `translate(${d.x - 3}px, ${d.y - 3}px)`;
        px = d.x; py = d.y;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      dots.forEach(d => d.el.remove());
    };
  }, [enabled]);

  // Konami sequence
  React.useEffect(() => {
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let buffer = [];
    const onKey = (e) => {
      buffer.push(e.key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        onChangelogToggle();
        buffer = [];
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Idle reveal of coords (after 4s without movement)
  React.useEffect(() => {
    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => onCoordsToggle(true), 4000);
    };
    const onAct = () => { onCoordsToggle(false); arm(); };
    arm();
    window.addEventListener('mousemove', onAct);
    window.addEventListener('scroll', onAct);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onAct);
      window.removeEventListener('scroll', onAct);
    };
  }, []);

  return null;
}

/* ─── Demolition easter egg (click the period) ─── */
function useDemolition() {
  React.useEffect(() => {
    let running = false;
    const overlay = document.createElement('div');
    overlay.className = 'demo-overlay';
    overlay.innerHTML = `
      <div class="stage-prompt" data-stage>
        <div class="prompt-text" data-prompt-text></div>
        <div class="prompt-actions" data-prompt-actions></div>
      </div>
      <div class="stage-restore">
        <div class="spin"></div>
        <div class="label">restoring matheog.com</div>
        <div class="text-bar" data-bar>[                    ]</div>
      </div>
    `;
    document.body.appendChild(overlay);
    const barEl = overlay.querySelector('[data-bar]');
    const promptText = overlay.querySelector('[data-prompt-text]');
    const promptActions = overlay.querySelector('[data-prompt-actions]');
    let barTimer = null;
    let autoTimer = null;

    const startBar = (onDone) => {
      const total = 20;
      let n = 0;
      barEl.textContent = '[' + ' '.repeat(total) + ']';
      barTimer = setInterval(() => {
        n = Math.min(n + 1, total);
        barEl.textContent = '[' + '█'.repeat(n) + ' '.repeat(total - n) + ']';
        if (n >= total) {
          clearInterval(barTimer); barTimer = null;
          if (onDone) onDone();
        }
      }, 180);
    };
    const resetBar = () => {
      if (barTimer) { clearInterval(barTimer); barTimer = null; }
      barEl.textContent = '[' + ' '.repeat(20) + ']';
    };
    const clearAutoTimer = () => {
      if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    };

    const goRestore = () => {
      clearAutoTimer();
      overlay.classList.add('restoring');
      startBar(() => {
        setTimeout(() => {
          overlay.classList.remove('show');
          setTimeout(() => {
            const root = document.documentElement;
            root.classList.remove('demo-2');
            setTimeout(() => {
              root.classList.remove('demo-1');
              overlay.classList.remove('restoring');
              resetBar();
              running = false;
            }, 800);
          }, 500);
        }, 400);
      });
    };

    const renderPrompt = (text, actions) => {
      promptText.textContent = text;
      promptActions.innerHTML = '';
      actions.forEach((a) => {
        const el = a.href
          ? document.createElement('a')
          : document.createElement('button');
        if (a.href) { el.href = a.href; }
        else { el.type = 'button'; }
        el.className = 'restore-btn';
        el.textContent = a.label;
        el.addEventListener('click', (ev) => {
          if (!a.href) ev.preventDefault();
          ev.stopPropagation();
          clearAutoTimer();
          a.onClick();
        });
        promptActions.appendChild(el);
      });
    };

    const stepRestore = () => {
      renderPrompt('Restore?', [
        { label: 'Restore', onClick: stepSure },
      ]);
    };
    const stepSure = () => {
      renderPrompt('Are you sure?', [
        { label: 'Yes', onClick: stepStillSure },
      ]);
    };
    const stepStillSure = () => {
      renderPrompt('Are you still sure?', [
        { label: 'Still sure', onClick: stepWait },
      ]);
    };
    let waitTimers = [];
    let libCounter = null;
    const clearWaitTimers = () => {
      waitTimers.forEach((t) => clearTimeout(t));
      waitTimers = [];
      if (libCounter) { clearInterval(libCounter); libCounter = null; }
    };
    const langs = ['Rust', 'Go', 'Zig', 'Elixir', 'OCaml', 'Haskell', 'Crystal', 'Kotlin', 'Swift', 'Nim', 'Gleam', 'COBOL', 'Lua', 'Erlang', 'F#', 'Scala', 'Clojure', 'Roc', 'Odin', 'V'];
    const pickLang = () => langs[Math.floor(Math.random() * langs.length)];
    const stepWait = () => {
      renderPrompt(
        "If you wait 10 more seconds it'll restore automatically, don't worry about it.",
        []
      );
      const swap = (delay, text) => {
        waitTimers.push(setTimeout(() => {
          promptText.textContent = text;
        }, delay));
      };
      swap(2000, `Rewriting everything in ${pickLang()}…`);
      // Library counter: ticks 54,000 → 54,698 over ~1.6s once it appears at 3.4s
      waitTimers.push(setTimeout(() => {
        let n = 54000;
        const target = 54698;
        promptText.textContent = `Installing ${n.toLocaleString()} Python libraries…`;
        libCounter = setInterval(() => {
          n += Math.floor(Math.random() * 24) + 8;
          if (n >= target) {
            n = target;
            clearInterval(libCounter); libCounter = null;
          }
          promptText.textContent = `Installing ${n.toLocaleString()} Python libraries…`;
        }, 50);
      }, 3400));
      swap(5400, 'Something broke, turning it off and on again…');
      swap(6600, '200 OK');
      autoTimer = setTimeout(() => {
        clearWaitTimers();
        stepLying();
      }, 10000);
    };
    const stepLying = () => {
      renderPrompt(
        "Alright, I was kidding. But before we restore it — tell me, you fell for it didn't you?",
        [
          { label: 'Yes', onClick: goRestore },
          { label: 'No',  onClick: stepCrash },
        ]
      );
    };
    const stepCrash = () => {
      clearAutoTimer();
      // Fake crash: replace document with a browser-style error page.
      // Easter egg only — user can refresh to recover.
      document.open();
      document.write(`<!doctype html><html><head><meta charset="utf-8"><title>This site can't be reached</title>
<style>
  html,body{margin:0;padding:0;height:100%;background:#fff;color:#202124;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
  .wrap{max-width:600px;margin:0 auto;padding:80px 24px;}
  .icon{width:72px;height:72px;border-radius:50%;background:#f1f3f4;display:flex;align-items:center;justify-content:center;margin-bottom:24px;font-size:36px;color:#5f6368;}
  h1{font-size:28px;font-weight:400;margin:0 0 12px;}
  p{font-size:14px;line-height:1.5;color:#5f6368;margin:0 0 8px;}
  code{background:#f1f3f4;padding:2px 6px;border-radius:4px;font-size:13px;}
  .btn{margin-top:32px;display:inline-block;background:#1a73e8;color:#fff;padding:8px 16px;border-radius:4px;font-size:14px;text-decoration:none;border:0;cursor:pointer;font-family:inherit;}
  .small{margin-top:48px;font-size:12px;color:#80868b;}
  .small a{color:#1a73e8;text-decoration:none;}
</style></head><body>
  <div class="wrap">
    <div class="icon">⚠</div>
    <h1>This site can't be reached</h1>
    <p><strong>matheog.com</strong>'s server IP address could not be found.</p>
    <p>Try:</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;• Checking the connection</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;• Checking the proxy and the firewall</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;• Running Windows Network Diagnostics</p>
    <p style="margin-top:16px;"><code>DNS_PROBE_FINISHED_NXDOMAIN</code></p>
    <button class="btn" onclick="location.reload()">Reload</button>
    <p class="small">just kidding — <a href="javascript:location.reload()">click here</a> to come back.</p>
  </div>
</body></html>`);
      document.close();
    };

    const run = (e) => {
      if (running) return;
      const t = e.target.closest('.period');
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      running = true;
      const root = document.documentElement;

      root.classList.add('demo-1');
      setTimeout(() => { root.classList.add('demo-2'); }, 1500);
      setTimeout(() => {
        stepRestore();
        overlay.classList.add('show');
      }, 3000);
    };

    document.addEventListener('click', run, true);
    return () => {
      document.removeEventListener('click', run, true);
      overlay.remove();
    };
  }, []);
}

/* ─── Reveal-on-scroll observer setup ─── */
function useScrollReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

window.NowTeaser = NowTeaser;
window.Footer = Footer;
window.ChangelogOverlay = ChangelogOverlay;
window.EasterEggs = EasterEggs;
window.useScrollReveal = useScrollReveal;
window.useDemolition = useDemolition;
