# Typography Spec — Silverline Portfolio

> Resolved values at 1400px viewport. All clamp() ranges noted as min → max.
> Colors listed as hex. Tokens in parentheses for reference.

---

## Token Quick Reference

| Token | Hex | Role |
|---|---|---|
| `--text` | `#E8E6DD` | Primary text |
| `--text-2` | `#B8B6AD` | Secondary — meta, labels, body supporting |
| `--text-dim` | `#6E7068` | Very dim — placeholders, timestamps |
| `--accent` | `#5DA67A` | Green — links, highlights, hover |
| Archivo | — | Structure font — nav, headings, UI, body |
| Geist Mono | — | Technical font — meta, tags, code, timestamps |
| Literata | — | Reading font — blog prose only |

---

## Base

| Element | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|
| `body` | Archivo | 15px | 400 | #E8E6DD | lh: 1.55 |

---

## Navigation

| Element | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|
| Nav bar | Archivo | 13px | 500 | #E8E6DD | ls: 0.02em |
| Brand (`.brand`) | Archivo | 15px | 800 | #E8E6DD | ls: -0.01em |
| Nav links | Archivo | 13px | 500 | #E8E6DD | hover: #5DA67A |
| Nav links (disabled) | Archivo | 13px | 500 | #6E7068 | pointer-events: none |

---

## Hero

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Eyebrow | `.hero-eyebrow` | Geist Mono | 11px | 400 | #6E7068 | ls: 0.08em |
| Sub tagline | `.hero-sub` | Archivo | 14–18px | 400 | rgba(245,240,232, 0.78) | clamp, lh: 1.5 |
| Terminal log | `.hero-log` | Geist Mono | 15px | 400 | rgba(245,240,232, 0.22) | lh: 1.8, ls: 0.01em |
| Terminal log (fresh) | `.line.fresh` | Geist Mono | 15px | 400 | rgba(245,240,232, 0.62) | — |
| CTA buttons | `.hero-meta-primary` | Geist Mono* | 12px | 700 | #B8B6AD | ls: 0.08em, h: 40px, uppercase |

*CTA in hero inherits Geist Mono from `.hero-meta`. Same class in contact section inherits Archivo from body.

---

## Section Scaffolding (shared across all sections)

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Section title | `.section-title` | Archivo | 28–44px | 800 | #E8E6DD | ls: -0.025em, lh: 1.05 |
| Section link | `.section-link` | Archivo | 13px | 500 | #5DA67A | underline, hover: #E8E6DD |

---

## About

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Body text | `.about-text` | Archivo | 16–20px | 400 | #B8B6AD | lh: 1.7, max-width: 72ch |
| Physics badge label | `.phys-badge` | Geist Mono | 15px | 600 | per-badge fg color | ls: 0.03em |

---

## Project Stack Cards

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Card label | `.project-card-label` | Geist Mono | 11px | 400 | per-card accent (0.85 opacity) | ls: 0.12em, uppercase |
| Card title | `.project-card-title` | Archivo | 32–72px | 800 | #E8E6DD | ls: -0.02em, uppercase |
| Card tagline | `.project-card-tagline` | Archivo | 14px | 400 | per-card accent (0.82 opacity) | lh: 1.65 |
| Stack chip tags | `.project-glass-tag` | Geist Mono | 11px | 500 | #B8B6AD | ls: 0.04em, pill border |

---

## Projects — "See All" Card

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Label | `.projects-see-all-label` | Archivo | 11px | 400 | #6E7068 | ls: 0.14em, uppercase |
| Heading | `.projects-see-all-heading` | Archivo | 36–54px | 700 | #E8E6DD | ls: -0.02em |
| Sub copy | `.projects-see-all-sub` | Archivo | 15px | 400 | #B8B6AD | lh: 1.7 |
| Button | `.projects-see-all-btn` | Geist Mono | 13px | 400 | #B8B6AD | ls: 0.08em, uppercase, border |

---

## Blog (WIP)

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| WIP note | `.blog-wip-note` | Geist Mono | 12px | 400 | #6E7068 | ls: 0.08em, uppercase |

---

## Contact CTA

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Tagline | `.contact-cta-tagline` | Archivo | 15–17px | 400 | #B8B6AD | lh: 1.65 |
| Email button (idle) | `.contact-email-btn` | Archivo | 12px | 700 | #B8B6AD | ls: 0.08em, h: 40px |
| Email address (reveal) | `.contact-email-btn__addr` | Geist Mono | 11px | 400 | #B8B6AD → #5DA67A | ls: 0.04em |
| SEE PROJECTS button | `.hero-meta-primary` | Archivo* | 12px | 700 | #B8B6AD | ls: 0.08em, h: 40px, uppercase |

*In this context inherits Archivo from body, not Geist Mono (no `.hero-meta` wrapper).

---

## Site Footer

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Copyright | `.footer-copy` | Geist Mono | 11px | 400 | #6E7068 | — |

---

## Blog Post Page

| Element | Class | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|---|
| Post title | `.post-title` | Archivo | 28–44px | 800 | #E8E6DD | ls: -0.025em |
| Post meta (date, tag) | `.post-header-meta` | Geist Mono | 11px | 400 | #6E7068 / #5DA67A | ls: 0.06em |
| Blog header title | `.blog-header-title` | Archivo | 36–72px | 800 | #E8E6DD | ls: -0.025em |
| Blog header sub | `.blog-header-sub` | Archivo | 18px | 400 | #B8B6AD | lh: 1.5 |
| Blog eyebrow | `.blog-header-eyebrow` | Archivo | 11px | 700 | #5DA67A | ls: 0.10em, uppercase |
| Note card title | `.note-title` | Archivo | 22px | 700 | #E8E6DD | ls: -0.02em |
| Note card desc | `.note-desc` | Archivo | 14px | 400 | #B8B6AD | lh: 1.6 |
| Note date / readtime | `.note-date` / `.note-readtime` | Geist Mono | 11px | 400 | #6E7068 | ls: 0.04em |
| Note tag | `.note-tag` | Geist Mono | 10px | 500 | #5DA67A | ls: 0.10em, uppercase |
| **Prose body** | `.blog-prose` | **Literata** | **18px** | **400** | **#1A1916** | lh: 1.75, warm bg |
| Prose h2 | `.blog-prose h2` | Archivo | 24px | 700 | #1A1916 | — |
| Prose h3 | `.blog-prose h3` | Archivo | 20px | 600 | #1A1916 | — |
| Prose code inline | `.blog-prose code` | Geist Mono | 0.875em (~15.75px) | 400 | #1A1916 | warm bg chip |
| Prose code block | `.blog-prose pre` | Geist Mono | 13px | 400 | #E8E6DD | dark inset on warm bg |

---

## Hover States Summary

| Element | Default color | Hover color |
|---|---|---|
| Nav links | #E8E6DD | #5DA67A |
| `.hero-meta-primary` | #B8B6AD | #5DA67A (border too) |
| `.contact-email-btn` | #B8B6AD | #5DA67A (border too) |
| `.projects-see-all-btn` | #B8B6AD | #5DA67A (border too) |
| `.section-link` | #5DA67A | #E8E6DD |
