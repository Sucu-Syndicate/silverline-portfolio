# matheog.com Homepage — Full Session Report

A complete, high-detail log of every design decision, iteration, value, and shipped behavior. Captures the full history including the design system change from v1 (warm parchment) to v2 (Direction A · Plotter, dark warm graphite) and the v3 token revision actually shipped.

---

## 0 · Project Brief Recap

- **Subject:** Mathe (Matheo Guevara), 17yo Argentina-based developer. Coding since 3, fundamentals-first, AI-native. Building Velvet (flagship) + others. Domain: `matheog.com`.
- **Audience:** LinkedIn visitors, devs, recruiters. Not optimizing for Google.
- **Goal:** Impress AND convert. Convert = visitor reads blog → reaches out → hires/collaborates.
- **Hero rule:** Must hook in 3 seconds. Not a resume, not "here are my projects." Feeling on landing: *"I'm interested in what this guy has to say."*
- **Hard rule:** Age (17) never on the hero — avoids bias poisoning the read.
- **Hard rule:** Word "builder" never appears in copy. Site + projects do that work.
- **Persona note:** he is a developer who builds things, not a "builder" — naming "builder" without context reads wrong (sounds like construction).

### Page Map (locked)
- `/` — homepage (this session's deliverable)
- `/blog` — main event, MDX
- `/about` + `/about/uses`
- `/now` — current building/thinking
- `/work/[slug]` — per-project case studies (no top-level `/work` until enough projects)

---

## 1 · Design System Evolution

### 1.1 v1 — Warm Parchment (initial spec)
The original locked v2 spec (in user's planning docs) was a warm-cream light register with a forest-green accent. Tokens were:
- `--hero-bg: #1A1410` warm near-black (hero only)
- `--hero-text: #F5F0E8` parchment (hero only)
- `--parchment: #FAF8F4` (page background)
- `--linen: #EDE0D4` (cards / surface lift)
- `--border: #DDD0C4`
- `--text: #2C1A0E` espresso
- `--text-secondary: #8C7060`
- `--green-dark: #2E5842` forest accent
- `--code-surface: #2C1A0E`
- Hue family: warm 60–80 OKLCH, no pure black/white.

The dark hero was a *cover*; you opened it and the book was warm. Same site, different light.

### 1.2 The pivot — "everything graphite feels flat" feedback
After building most of the homepage on v1, the read became too monochrome on the cream register. We considered two paths:
- (rejected) introduce a light section — would break the worklog hero's habitat
- **(chosen)** flip the homepage entirely to a dark register, and reserve the warm cream for the `/blog` body register only

Rationale: the **worklog hero terminal needs a dark surface to read natively**, not a "dark mode" variant of a light page. The system stays two-register, but the registers map cleanly: structure = dark, reading = warm.

### 1.3 v2 — Direction Exploration (3 directions)
Built and presented at `Design Specs.html` with side-by-side mini hero previews, swatch rows, full token tables, type rendered, comparison table, pros/cons.

#### Direction A — Plotter (CHOSEN)
Near-black warm graphite. IDE/terminal coded.

#### Direction B — Workshop (rejected for homepage; reserved for `/blog`)
Same warm graphite idea but lifted two stops. Warmer, lived-in.
- `--bg: #FAF8F4` parchment
- `--surface: #EDE0D4` linen
- `--border: #DDD0C4` warm border
- `--text: #2C1A0E` espresso
- `--text-secondary: #8C7060` warm secondary
- `--green-dark: #2E5842` deep accent

#### Direction C — Spec sheet (rejected entirely)
Inverted: cold bone-grey light + heavy black blocks. Linear/Vercel-doc territory. Failed the "warm and editorial" test.

### 1.4 v3 — Locked tokens (currently shipped)
After picking A, the hex values were tuned warmer than the design-specs page proposed. **These are the actual values in `styles.css` right now:**

```css
:root {
  /* ── Direction A · Plotter (locked v3) ── */
  /* Surfaces */
  --bg:         #0F100E;
  --surface:    #161714;
  --surface-2:  #1A1B18;
  --raised:     #222420;
  --border:     #2A2C26;
  --border-2:   #34362F;

  /* Ink */
  --text:       #E8E6DD;
  --text-2:     #B8B6AD;
  --text-dim:   #6E7068;

  /* Accent — green stays */
  --accent:      #5DA67A;   /* light green for dark surface */
  --accent-deep: #2E5842;   /* forest, used sparingly */
  --accent-bg:   #1A2620;   /* tint background for accent moments */

  /* Aliases for legacy v1 refs */
  --hero-bg:    var(--bg);
  --hero-text:  var(--text);
  --green-dark: var(--accent);
  --parchment:  var(--bg);
  --linen:      var(--surface);
  --text-secondary: var(--text-2);
  --code-surface:   var(--surface-2);

  /* Type */
  --font-structure: "Archivo", system-ui, sans-serif;
  --font-reading:   "Literata", Georgia, serif;
  --font-mono:      "Geist Mono", ui-monospace, monospace;
}
```

#### Why the values shifted A→v3
- All neutrals warmed slightly (hue 60–80 maintained)
- Borders darkened to read as hairlines, not panels
- Accent went **lighter** (`#5DA67A`) for legibility on dark surface; `#2E5842` retained as `--accent-deep` for sparing use
- Added `--accent-bg: #1A2620` — a green-tinted dark for moments where green should "ambient" (project tags, /now block hover)

#### Aliases
v1 token names are kept as aliases pointing to v3 values, so older component CSS keeps working without churn. This is intentional — the system is designed so a future site-wide flip back to warm-cream (e.g. for a print version) just needs the alias targets reassigned.

---

## 2 · Typography (Locked)

Three families, three registers:

| Family | Register | Use |
|---|---|---|
| **Archivo** (400/500/600/700/800/900) | Structure | UI, headlines, nav, cards, body text |
| **Literata** (400/500/600 + italic 400) | Reading | Blog body & pull quotes ONLY. Never in UI. |
| **Geist Mono** (400/500) | Technical signal | Hero terminal, eyebrows, meta, timestamps, coords |

Loaded as one Google Fonts import in `styles.css`.

### Homepage type rules
| Element | Spec |
|---|---|
| Hero eyebrow | 11px Geist Mono, uppercase, 0.12em tracking, with 6px pulsing green dot |
| Hero h1 | Archivo 900, `clamp(56px, 9vw, 132px)`, line-height 0.96, letter-spacing -0.035em |
| Hero subline | 18px Archivo 400, `--text` at 0.78 alpha, max 44ch |
| Hero meta links | 11px Geist Mono uppercase, 0.06em tracking, 0.45 alpha |
| Section label | 11px Archivo 700 uppercase, 0.10em tracking |
| Section title | Archivo 800, `clamp(28px, 4vw, 44px)`, line-height 1.05 |
| Project flagship h3 | 40px Archivo 800 |
| Project standard h3 | 26px Archivo 800 |
| Project body | 14px (16px flagship) |
| Stack tags | 10px Geist Mono, 4×8 padding |
| Post card title | 22px Archivo 700 |
| Post card meta | 10px Geist Mono uppercase 0.10em |
| Now block label | 11px Geist Mono uppercase, `--accent` |
| Now block text | `clamp(18px, 2.2vw, 24px)` Archivo 600 |
| Footer mark | `clamp(80px, 14vw, 180px)` Archivo 900 |
| Buenos Aires coords | 10px Geist Mono, 0.04em, 0.35 alpha |
| Hero terminal lines | 15px Geist Mono, line-height 1.8, 0.22 alpha (0.62 fresh) |

### Hard bans (typography)
- Banned faces: Inter, Roboto, DM Sans, Playfair, Fraunces, Space Grotesk, Syne, IBM Plex, Outfit, Plus Jakarta, Instrument Sans
- No `background-clip: text`, no gradient text
- Literata never in UI
- Geist Mono never decorative

---

## 3 · Page Architecture & Banding

```
┌─────────────────────────────────────┐
│  Hero            (band: --bg)       │  Worklog 50/50, hero-as-terminal
├─────────────────────────────────────┤
│  Projects        (band: --bg)       │  flagship + 2 satellites
├─────────────────────────────────────┤
│  Writing         (band: --surface)  │  the lift — slim marquee
├─────────────────────────────────────┤
│  /now teaser     (band: --bg)       │  time-aware greeting
├─────────────────────────────────────┤
│  Footer          (band: --bg)       │  giant Archivo mark + meta
└─────────────────────────────────────┘
```

- Section padding: `clamp(80px, 12vh, 140px) clamp(20px, 4vw, 56px)`
- Section max-width: 1400px
- Hero/parchment seam: clean cut, no gradient (was a gradient first; cut for confidence)

---

## 4 · Hero — Variant Exploration & Worklog Final

5 variants explored, 1 chosen as default, all 5 retained as Tweaks.

### 4.1 Variants
- **Statement** — massive Archivo 900 manifesto, single line of warm green secondary, coords as footnote. LinkedIn-safest.
- **Worklog** (DEFAULT) — 50/50 split, hero-as-terminal on right
- **Index** — numbered TOC (01 Writing / 02 Building / 03 Thinking)
- **Stack** — text overlapping a slow WebGL/canvas element
- **Single Question** — one sentence + half a page of negative space

### 4.2 Worklog — left side
- Geist Mono eyebrow `[ matheog/now ]` with pulsing 6px green dot (2s ease)
- Archivo 900 h1 with the click-target period at the end
- `.green` span for the green word
- 18px subline at 0.78 alpha, max 44ch
- Hero meta row: 28px gap, 11px mono, 0.06em uppercase

### 4.3 Worklog — right side: hero-as-terminal
The most distinctive move on the page.

```css
.hero-log {
  position: absolute;
  top: 0; right: 0;
  width: 50%; height: 100%;
  contain: strict;
  overflow-anchor: none;
  font-family: Geist Mono;
  font-size: 15px;
  line-height: 1.8;
  color: rgba(245, 240, 232, 0.22);
  mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 92%, transparent 100%);
  pointer-events: none;
}
.hero-log-stream {
  position: absolute;
  bottom: clamp(40px, 6vh, 80px);
  /* anchored from the bottom so new lines push up */
}
.hero-log .line.fresh { color: rgba(245, 240, 232, 0.62); }
.hero-log .line.cursor::after { content: "█"; animation: blink 1s steps(2) infinite; }
```

Behavior:
- Lines push every **700–1800ms** (random within range)
- Fresh line pops at 0.62 alpha then settles to 0.22 over the next push
- Blinking cursor on the latest line only
- Mask fades top (0–22%) and bottom (92–100%)
- Anchored absolutely from the bottom inside `overflow-anchor: none` so new lines push but never influence document flow
- `contain: strict` on `.hero-log` keeps mutations from leaking layout signals out

#### Iteration history (terminal)
- v1: multi-color tags (red `commit`, green `ok`, cyan `note`) — too "look-at-me", scrapped
- v2: scoped terminal-window with chrome (titlebar, dot) — defeated the "the hero IS terminal" idea
- v3: single light tint (final), bigger 15px font (was 13px), full-height, removed window chrome
- Lines fed from `terminal-lines.js` — push more lines to extend the pool

#### Content mix
60/40 build-to-thought:
- Build-side: `commit –m "…"`, `pnpm build`, `vercel deploy`, `pushed velvet/main`, `pnpm test`, `cargo run`, `gh pr merge`
- Thought-side: `note: pull-quotes feel cleaner with em-dashes`, `idea: the blog is the funnel`, `realised: 'builder' has too many meanings`

---

## 5 · Easter Eggs

### 5.1 Period — hover & click
**Hover (final):**
```css
.hero h1 .period:hover {
  color: rgba(245, 240, 232, 0.35);
  text-shadow: none;
  filter: saturate(0.2);
  transition: color 0.4s ease, filter 0.4s ease;
}
```

**Iteration:**
- v1: glitchShake `steps(2) infinite` translate+skew + RGB chromatic split text-shadow — too jittery
- **Final:** desaturated parchment grey wash, no shake, no RGB split. Quiet hint at the demo.

**Click:** triggers full demolition (§6).

### 5.2 Buenos Aires coords
- Geist Mono 10px, top-right of hero, 0.35 alpha
- Hidden by default
- Reveals on **4s of idle** (no mousemove, no scroll) OR hover near top of hero
- Coords: `-34.6037, -58.3816`
- Was originally going to be visible; "more easter-eggy not in your face" feedback hid it

### 5.3 Cursor trail
6 fading green dots, hero only, mix-blend `screen`, opacity transition 0.6s.

### 5.4 Konami code
↑↑↓↓←→←→ba opens a `~/changelog` overlay:
- 680px wide, 80vh max, blurred backdrop (8px)
- Header in `--accent` (green)
- Rows: 90px date col + content, top-border 0.06 alpha
- Build receipts: real iteration log dates
- "ESC TO CLOSE" hint at bottom

### 5.5 Time-aware greeting
In the /now block — morning/afternoon/evening/late-night variations.

---

## 6 · The Demolition Easter Egg — Full Spec

The most-iterated single element of the session. Complete final flow:

### 6.1 Stage 1 — Strip (auto, on click)
| Time | Event |
|---|---|
| 0.0s | Click the period |
| 0.0s | `html.demo-1` added → site desaturates over 1.4s |
| 1.5s | `html.demo-2` added → strips to base HTML (Times New Roman, blue underlined links, no shadows/radius/masks, padding collapses) |
| 3.0s | Modal fades in (centered, no border, no background) |

The page remains scrollable through both stages. Hidden during demo-2: `.grain`, `.hero-log`, `.coords`, `.cursor-dot`, `.nav`.

### 6.2 Stage 2 — The dialog (5 text steps)
Borderless centered modal, black text on the now-stripped page.

| Step | Text | Buttons |
|---|---|---|
| 1 | Restore? | *Restore* |
| 2 | Are you sure? | *Yes* |
| 3 | Are you still sure? | *Still sure* |
| 4 | If you wait 10 more seconds it'll restore automatically, don't worry about it. | (none — auto cycle below) |
| 5 | Alright, I was kidding. But before we restore it — tell me, you fell for it didn't you? | *Yes* / *No* |

### 6.3 Step 4 — the wait sequence (10s, no buttons)
Prompt text cycles automatically while the auto-timer ticks:

| Offset | Text |
|---|---|
| +2.0s | `Rewriting everything in {randomLang}…` |
| +3.4s | `Installing {n} Python libraries…` (counter ticks) |
| +5.4s | `Something broke, turning it off and on again…` |
| +6.6s | `200 OK` |
| +10.0s | Auto-advance to step 5 |

#### Random language pool (20, fresh per click)
Rust · Go · Zig · Elixir · OCaml · Haskell · Crystal · Kotlin · Swift · Nim · Gleam · COBOL · Lua · Erlang · F# · Scala · Clojure · Roc · Odin · V

#### Library counter
- Starts: 54,000
- Target: 54,698
- Tick: every 50ms
- Step: random 8–32
- Total ramp: ~1.6s
- Format: `n.toLocaleString()` so it displays with comma

### 6.4 Step 5 branches
**Yes** → runs restore animation (§6.5).

**No** → fakes a real browser crash:
- `document.open() + document.write()` replaces entire DOM
- Renders Chrome-style "This site can't be reached" page:
  - `⚠` icon in light grey circle (72×72)
  - h1: "This site can't be reached"
  - body: `matheog.com's server IP address could not be found.`
  - bullet list: connection / proxy & firewall / Windows Network Diagnostics
  - code block: `DNS_PROBE_FINISHED_NXDOMAIN`
  - blue "Reload" button (`#1a73e8`)
  - footer link: "just kidding — click here to come back" (reloads)
- DOM is genuinely gone — refresh = back. Sandbox prevents truly bricking the tab.

### 6.5 Restore animation
| Element | Spec |
|---|---|
| Spinner | 16px square, 2px black border (`#15171A`), top transparent, 0.7s rotate |
| Label | "restoring matheog.com", 14px Geist Mono, black |
| Bar | 20-cell ASCII fill, 14px Geist Mono, black, 0.12em tracking, 180ms tick |
| Total duration | ~3.6s |
| End | removes `demo-2` (color floods back over 1.4s), removes `demo-1`, resets state |

### 6.6 Survival rules (CSS hardening)
The modal must survive the `demo-2` strip. Real CSS:
```css
html.demo-2 .demo-overlay,
html.demo-2 .demo-overlay *::before,
html.demo-2 .demo-overlay *::after {
  font-family: "Geist Mono" !important;
  background: revert !important;
  color: revert !important;
  /* …all property reverts… */
}
html.demo-2 .demo-overlay {
  background: transparent !important;
  border: 0 !important;
  color: #15171A !important;
  pointer-events: auto !important;
}
html.demo-2 .demo-overlay .label,
html.demo-2 .demo-overlay .text-bar {
  color: #15171A !important;
}
html.demo-2 .demo-overlay .prompt-actions {
  display: flex !important;
  gap: 12px !important;
}
```

### 6.7 Iteration history (demolition specifically)
1. v1: auto-firing animation (no buttons) — too quick, easy to miss
2. v2: single `Restore?` button — better breathing room
3. v3: bordered modal — felt boxy, border removed
4. Spinner: 36px → 22px → 16px (each step better proportion)
5. Multi-stage prompt added: Restore? → Are you sure? → But you wanted this. Are you still sure? → 10s wait button → tell me about your day → email mailto
6. "But you wanted this." removed (redundant)
7. 10s wait button removed (auto-progresses, more dramatic)
8. Email mailto branch replaced with "fell for it didn't you?" framing
9. "Yes/no about your day" replaced with "Yes/no fell for it"
10. **No path → fake browser crash** (was: just runs restore)
11. Wait-message sequence (Rust / Python libs / 200 OK) added
12. "lying" → "kidding" (one-word swap)
13. Library counter: static `54,698` → animated tick
14. Language: static `Rust` → random from pool of 20

---

## 7 · Projects Section

### 7.1 Slots
| Position | Project | Treatment |
|---|---|---|
| Flagship | Velvet | Larger card, 16:9 thumb, 40px h3, 16px body, min-height 520, spans 2 grid rows |
| Satellite | Grill-Me | Standard, 16:10 thumb, 26px h3, 14px body |
| Satellite | Open Memory MCP | Standard |

Layout grid: `1.4fr 1fr`, gap 24px, flagship spans 2 rows.

### 7.2 Card spec
```css
.proj {
  background: var(--linen);   /* maps to --surface = #161714 */
  padding: 32px;              /* 40px on flagship */
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.4s, background 0.4s;
}
.proj:hover { transform: translateY(-4px); }
.proj-thumb {
  background: repeating-linear-gradient(135deg, var(--border) 0 1px, transparent 1px 12px), var(--code-surface);
  border: 1px solid var(--border);
}
.proj-stack span {
  background: var(--accent-bg);
  color: var(--accent);
  font: 10px Geist Mono;
}
.proj-arrow {
  position: absolute; top: 32px; right: 32px;
}
.proj:hover .proj-arrow {
  transform: translate(4px, -4px);
  color: var(--accent);
}
```

### 7.3 Layout variants (Tweaks)
1. **Asymmetric flagship** (default) — Velvet larger, others stacked
2. **Newspaper rows** — full-width rows with rule lines
3. **Index cards** — equal grid; hover background → `--raised`, 2px green top edge via inset shadow, 2px lift

### 7.4 "more →" link
- 13px Archivo 500
- Color: `--accent`
- Border-bottom 1px `--accent`, padding-bottom 2px
- Hover: color and border → `--text`

---

## 8 · Writing Strip (most-iterated after demolition)

### 8.1 Final layout
- Track wrap: 140px tall (was 320px — too dominant)
- Mask: linear horizontal fade 0→10%→90%→100%
- Track: `display: flex`, gap 80px, white-space nowrap, will-change transform
- Focus zone: 1px vertical line, 80% height, `--accent` at 0.35, with 6px dot caps top and bottom

### 8.2 Card spec
- 22px Archivo 700 title
- 10px Geist Mono uppercase meta with `.accent` span
- Default state: opacity 0.30, scale 0.96
- In-focus: opacity 1, scale 1.04, color → `--text`
- Transitions: 0.5s ease-out-expo on opacity/transform/color

### 8.3 Speed iteration
| Version | Speed | Verdict |
|---|---|---|
| v1 | 0.32 px/ms | Too slow, sluggish |
| v2 | 1.6 px/ms | Too fast, blurry |
| **v3 (final)** | **0.8 px/ms** | Readable at speed, decisive |

### 8.4 Motion blur iteration
- v1: max 6px proportional to speed — too cinematic
- **Final:** max 1px, only kicks in mid-brake — implies motion without obscuring

### 8.5 Hover behavior
Doesn't stop instantly — easing factor `0.06` toward target velocity gives the slow brake-and-jerk feel. Releases the same way.

### 8.6 Title copy
- v1: "Hover to read" — too literal
- **Final: "Catch one as it passes."** — fits the new pace

### 8.7 Section margin & band
- 80px from /now block
- Section background: `--surface` (#161714) — the only band lift on the page

### 8.8 Other variants (Tweaks)
- Divider list (rows, no cards, hairline rules)
- Big-three featured (three large editorial cards, no marquee)

### 8.9 Content
Lorem-style placeholders pending real post titles. Marquee loops a fixed pool — when content goes live the loop just gets longer.

---

## 9 · /now Teaser & Footer

### 9.1 /now block
```css
.now-block {
  margin-top: 80px;
  padding: 36px 40px;
  background: var(--linen);
  border-radius: 4px;
  cursor: pointer;
}
.now-block:hover { background: var(--accent-bg); }
```
- 3-col grid: label / text / greet
- Label: 11px Geist Mono uppercase 0.12em, color `--accent`
- Text: `clamp(18px, 2.2vw, 24px)` Archivo 600
- Greet: 11px Geist Mono, time-aware

### 9.2 Footer
- 64px top padding, 48px bottom, top border 1px `--border`
- Grid: `1fr auto`, gap 32px, items aligned to baseline
- Mark: `clamp(80px, 14vw, 180px)` Archivo 900, line-height 0.9, letter-spacing -0.04em
- Meta column right-aligned: 11px mono, 0.04em, gap 6px
- Bottom strip: 32px top margin, 10px Geist Mono uppercase, justified

---

## 10 · Grain (iteration log)

| Stage | Value | Verdict |
|---|---|---|
| v1 | 0.04 | Too noisy, read as paper |
| v2 | mid-tier | Better, still noticeable |
| **v3 (final)** | **0.025 globally / 0.04 hero** | Reads as warmth, not paper |

Real CSS:
```css
.grain {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 100;
  opacity: 0.025;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;…feTurbulence…baseFrequency='1.6'…");
}
.grain.hero-grain { opacity: 0.04; }
```

---

## 11 · Tweaks Panel

Toggled from toolbar. Floating panel:

| Section | Options |
|---|---|
| Hero | Statement / Worklog / Index / Stack / Question |
| Projects | Asymmetric flagship / Newspaper rows / Index cards |
| Writing | Marquee with focus zone / Divider list / Big-three featured |
| Atmosphere | Easter eggs on/off, Grain on/off |

**Defaults shipped:** Worklog · Asymmetric · Marquee · easter eggs on · grain on.

---

## 12 · Engineering Notes

### 12.1 Layout safety
- `overflow-anchor: none` on `body`, `.hero-log`, `.hero-log-stream`
- `contain: strict` on `.hero-log`
- `.hero-log-stream` anchored absolutely from the bottom — new lines never influence document flow
- No `scrollIntoView` anywhere
- IntersectionObserver for scroll reveal, `threshold: 0.1`, fires once

### 12.2 Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.3 Responsive (≤920px)
- Hero grid collapses to single column
- Hero log min-height 200px, opacity 0.4
- Projects grid → 1fr, flagship loses span
- Footer grid → 1fr, meta left-aligned

### 12.4 Easings used
- `cubic-bezier(0.16, 1, 0.3, 1)` — ease-out-expo (everywhere transform-based)
- `ease` — color/filter only
- `linear` — only the spinner & marquee track
- **No bounce or elastic anywhere**

---

## 13 · File Tree

```
Homepage.html              ← root, all script imports
styles.css                 ← full design system + all variants (890 lines)
components/
  hero.jsx                 ← 5 hero variants
  projects.jsx             ← 3 project layouts
  writing.jsx              ← 3 writing strip variants
  extras.jsx               ← /now, footer, demolition, konami, idle coords, scroll reveal
terminal-lines.js          ← editable pool for hero terminal
tweaks-panel.jsx           ← variant selector
Design Specs.html          ← side-by-side of the 3 color directions
SESSION_REPORT.md          ← this file
```

---

## 14 · Pending (For You)

1. **Real project blurbs** — current 2-line copy is placeholder for Velvet, Grill-Me, Open Memory MCP
2. **Hero headline pick** — five drafts live as variants; pick one (or remix two)
3. **Featured imagery** — placeholders are striped patterns labeled `velvet · cover` etc.
4. **Real post titles** — lorem-style placeholders in the marquee
5. **Domain confirmation** — `matheog.com` is hardcoded across nav, footer, mailto link
6. **Sanity vs roll-your-own admin** — pinned, deferred until variants are picked
7. **Blog identity** — name-vs-just-`/blog` decision pinned
8. **Real terminal line pool** — current entries are placeholder; swap in real commit messages, build outputs, thoughts

---

## 15 · CC Handoff Plan (Next Session)

Once variant picks above are locked, next deliverable:
- React/Next.js component breakdown with prop contracts
- Data shape per section (matched against backend CC built)
- Sanity schema OR roll-your-own admin spec
- Route definitions (`/`, `/blog`, `/blog/[slug]`, `/now`, `/about`, `/about/uses`, `/work/[slug]`)
- Asset import paths and font loading strategy
- Migration path for the homepage from this static prototype to live Next.js
- Tweaks panel sunset plan (Tweaks are a design tool, not for production — they get removed at handoff)

---

## 16 · Pull Quotes & Principles

- *Motion is evidence, not decoration* — the motion test
- *The hero IS the terminal* — on the worklog hero
- *Same site, different light — not a theme switch* — on the dark→cream transition
- *More steps within dark, not introducing a light section* — the banding decision
- *Catch one as it passes* — the marquee title
- *"things to explore" energy without the chaos* — the PostHog-adjacent target
- *Less is more* — the homepage stayed short and sweet

---

## 17 · Counts & Timings — Quick Reference

| Thing | Value |
|---|---|
| Color tokens (v3) | 13 (6 surfaces + 3 ink + 3 accent + 1 BG tint) |
| Aliases (v1 compat) | 7 |
| Hero variants | 5 (1 default + 4 in Tweaks) |
| Project layouts | 3 |
| Writing strip variants | 3 |
| Easter eggs total | 6 (period hover, period click=demo, coords, cursor trail, konami, time-greet) |
| Demolition modal text steps | 5 (8 messages incl. wait sequence) |
| Languages in random pool | 20 |
| Library counter range | 54,000 → 54,698, step 8–32, 50ms tick |
| Marquee cruise speed | 0.8 px/ms |
| Marquee hover easing | 0.06 |
| Terminal line cadence | 700–1800ms |
| Terminal font size | 15px Geist Mono, line-height 1.8 |
| Spinner size (final) | 16px / 2px border / 0.7s rotate |
| ASCII bar tick | 180ms × 20 cells |
| Idle-coords reveal | 4s |
| Grain (global / hero) | 0.025 / 0.04 |
| Section padding | clamp(80px, 12vh, 140px) clamp(20px, 4vw, 56px) |
| Section max-width | 1400px |
| Project grid | 1.4fr 1fr, gap 24px |
| Card padding | 32px standard, 40px flagship |
| Hero h1 size | clamp(56px, 9vw, 132px) |
| Footer mark size | clamp(80px, 14vw, 180px) |

---

End of report.
