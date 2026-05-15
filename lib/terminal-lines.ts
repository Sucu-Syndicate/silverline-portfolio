export type TerminalTag = 'commit' | 'build' | 'ship' | 'think' | 'note' | 'quote';

export interface TerminalLine {
  tag: TerminalTag;
  text: string;
}

export const TERMINAL_LINES: TerminalLine[] = [
  // ── work / commits ──────────────────────────────────────
  { tag: 'commit', text: 'feat(velvet): VARRO scaffolds wired into obsidian' },
  { tag: 'commit', text: 'fix: 65ch cap was getting overruled by parent' },
  { tag: 'commit', text: 'refactor: hoist log lines into config' },
  { tag: 'commit', text: 'docs(uses): add obsidian + dataview workflow' },
  { tag: 'commit', text: 'chore: kill DM Sans imports for good' },
  { tag: 'commit', text: 'feat(grill-me): pin sanity-vs-roll-own decision' },
  { tag: 'commit', text: 'feat: scroll reveal via IntersectionObserver, no listeners' },
  { tag: 'commit', text: 'fix(hero): coords easter egg now idle-revealed' },
  { tag: 'commit', text: 'feat(open-memory): structured recall across sessions' },
  { tag: 'commit', text: 'style: archivo 900 only above weight 600' },
  { tag: 'commit', text: 'fix: literata never enters UI scope' },

  // ── builds / tests ──────────────────────────────────────
  { tag: 'build', text: 'next build · compiled in 1.2s · 18 routes' },
  { tag: 'build', text: 'pnpm build · turbopack · 4.4s' },
  { tag: 'build', text: 'mdx pipeline · 14 posts · 0 warnings' },
  { tag: 'build', text: 'lighthouse · 100 / 100 / 100 / 100' },
  { tag: 'build', text: 'typecheck · 0 errors · 0 warnings' },
  { tag: 'build', text: 'vitest · 47 passed in 380ms' },

  // ── ships ───────────────────────────────────────────────
  { tag: 'ship', text: 'deployed matheog.com · vercel · ok' },
  { tag: 'ship', text: 'open-memory-mcp · v0.4.1 · published' },
  { tag: 'ship', text: 'grill-me v2 · session checkpoint shipped' },

  // ── thoughts / notes ────────────────────────────────────
  { tag: 'think', text: '// what if the hero is the terminal' },
  { tag: 'think', text: '// re-reading kleppmann ch.4' },
  { tag: 'think', text: '// fundamentals before syntax, always' },
  { tag: 'think', text: '// motion is evidence, not decoration' },
  { tag: 'think', text: '// the blog replaces the feed' },
  { tag: 'think', text: '// archivo at 900 is honest. it knows it' },
  { tag: 'think', text: '// software that earns its weight' },
  { tag: 'think', text: "// 17 isn't the headline. the work is" },
  { tag: 'think', text: '// every problem starts on a tuesday' },
  { tag: 'think', text: '// less, and louder' },

  // ── quotes ──────────────────────────────────────────────
  { tag: 'quote', text: '"Nobody hates the good ones, they hate the great ones" — Kobe Bryant' },
  { tag: 'quote', text: '"The worst thing I can be is the same as everybody else" — Arnold Schwarzenegger' },
  { tag: 'quote', text: '"The world offers you comfort but you were not made for comfort, you were made for greatness" — Pope Benedict XVI' },
  { tag: 'quote', text: '"You have power over your mind, not outside events" — Marcus Aurelius' },
  { tag: 'quote', text: '"Don\'t worry about your individual potential. You\'ll never know how great you might\'ve become unless you try." — Mike Metzner' },
  { tag: 'quote', text: '"A man cannot remake himself without suffering, for he is both the marble and the sculptor" — Alexis Carrel' },

  // ── system-y output ─────────────────────────────────────
  { tag: 'note', text: 'reading: designing data-intensive applications' },
  { tag: 'note', text: 'listening: ambient · 432hz · loop' },
  { tag: 'note', text: 'tz: america/argentina/buenos_aires' },
  { tag: 'note', text: 'editor: nvim · obsidian · cursor (sometimes)' },
  { tag: 'note', text: 'coffee count today: 3' },
  { tag: 'note', text: 'last push: 14m ago · main' },
  { tag: 'note', text: 'open tabs: 47 · do not judge' },
];
