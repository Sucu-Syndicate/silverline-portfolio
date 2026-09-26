// terminal-lines.js
// Edit this list freely. Add your own lines, mix freely.
// Tags drive subtle styling; if you don't care just leave them all as 'commit'.
//   commit · code-y, neutral
//   build  · build/test output
//   ship   · deploys, releases
//   think  · thoughts, italicized hint
//   note   · plain notes
//
// Lines should be SHORT — they sit on a single row in the terminal.
// Aim for ~50-80 chars each. Don't worry about exact ts; the engine
// generates timestamps based on when the line "prints".

window.TERMINAL_LINES = [
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
  { tag: 'think', text: '// 17 isn\'t the headline. the work is' },
  { tag: 'think', text: '// every problem starts on a tuesday' },
  { tag: 'think', text: '// less, and louder' },

  // ── system-y output ─────────────────────────────────────
  { tag: 'note', text: 'reading: designing data-intensive applications' },
  { tag: 'note', text: 'listening: ambient · 432hz · loop' },
  { tag: 'note', text: 'tz: america/argentina/buenos_aires' },
  { tag: 'note', text: 'editor: nvim · obsidian · cursor (sometimes)' },
  { tag: 'note', text: 'coffee count today: 3' },
  { tag: 'note', text: 'last push: 14m ago · main' },
  { tag: 'note', text: 'open tabs: 47 · do not judge' },

  // ── ADD YOUR OWN BELOW ──────────────────────────────────
  // { tag: 'think', text: '// ' },
  // { tag: 'commit', text: '' },
];
