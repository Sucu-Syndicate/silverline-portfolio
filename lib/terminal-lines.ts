export type TerminalLineTag =
  | 'commit'
  | 'build'
  | 'ship'
  | 'think'
  | 'note'
  | 'quote';

export interface TerminalLine {
  tag: TerminalLineTag;
  text: string;
}

export const terminalLines: TerminalLine[] = [
  // ── QUOTES ────────────────────────────────────────────────────────────────
  {
    tag: 'quote',
    text: '"I was here."',
  },
  {
    tag: 'quote',
    text: '"I think in systems, create something from nothing, and use AI at a level most people don\'t know is possible."',
  },
  {
    tag: 'quote',
    text: '"It\'s going to hurt."',
  },

  {
    tag: 'quote',
    text: '"if you have 5 hours to chop down a tree spend 3 sharpening your axe"',
  },
  {
    tag: 'quote',
    text: '"the farmer does not take out the seed to see if its growing every day"',
  },

  {
    tag: 'quote',
    text: '"it\'s like watching a very very good movie for the first time except you can rewatch it again for the first time because no single project is ever the same"',
  },


  {
    tag: 'quote',
    text: '"vibe coding is going with the flow blindly. this is collaborative coding — based on programming fundamentals and basics, using critical thinking and logic, using ai to enhance and challenge your brain, not offload your thinking."',
  },
  { tag: 'quote', text: '"Nobody hates the good ones, they hate the great ones" — Kobe Bryant' },
  { tag: 'quote', text: '"The worst thing I can be is the same as everybody else" — Arnold Schwarzenegger' },
  { tag: 'quote', text: '"The world offers you comfort but you were not made for comfort, you were made for greatness" — Pope Benedict XVI' },
  { tag: 'quote', text: '"You have power over your mind, not outside events" — Marcus Aurelius' },
  { tag: 'quote', text: '"Don\'t worry about your individual potential. You\'ll never know how great you might\'ve become unless you try." — Mike Metzner' },
  { tag: 'quote', text: '"A man cannot remake himself without suffering, for he is both the marble and the sculptor" — Alexis Carrel' },

  // ── COMMITS ───────────────────────────────────────────────────────────────
  {
    tag: 'commit',
    text: '[548c981] scaffold: next.js 15 app router, tailwind v4, clerk, prisma, supabase',
  },
  { tag: 'commit', text: 'feat(velvet): VARRO scaffolds wired into obsidian' },
  {
    tag: 'commit',
    text: '[ceb5ea5] nuke legacy ui — 72 files deleted, 38 api routes intact',
  },
  {
    tag: 'commit',
    text: '[233d75b] ptask-005: homepage hero, terminal animation, ghost number cards',
  },
  {
    tag: 'commit',
    text: '[ff4eb24] ptask-006: mdx blog pipeline, rss feed, reading time',
  },
  {
    tag: 'commit',
    text: '[0374d96] fix: dvh → svh scroll jolt on mobile safari',
  },
  {
    tag: 'commit',
    text: '[3a2e5cf] feat: favicon m. via imagemetadata + imageresponse, no png',
  },
  {
    tag: 'commit',
    text: '[97b6925] easter egg: idle reveal at 15s — text randomized each visit',
  },
  {
    tag: 'commit',
    text: '[a1a91a9] services/transcode: fastapi + ffmpeg + dockerfile ready for cloud run',
  },
  {
    tag: 'commit',
    text: '[5f63ae0] api/admin/lessons upload-presign + lib/r2.ts cloudflare r2 integration',
  },
  {
    tag: 'commit',
    text: '[36f668d] velvet-CLAUDE: obsidian sot path references updated across repo',
  },
  {
    tag: 'commit',
    text: '[v1.0.0] splitwave: pyinstaller onedir, cpu-only torch, dist/Splitwave.zip 254mb',
  },
  {
    tag: 'commit',
    text: '[init] meridian: 7-stage retrieval — typo correction → bm25 → semantic → cross-encoder → gemini',
  },

  // ── BUILDS ────────────────────────────────────────────────────────────────
  {
    tag: 'build',
    text: 'velvet — aes-128 hls encryption + cloud run southamerica-east1 + cloudflare r2',
  },
  {
    tag: 'build',
    text: 'silverline portfolio: matheo.guevara.ar — next.js 15, tailwind v4, framer motion, mdx',
  },
  {
    tag: 'build',
    text: 'myobscelium: 19-tool python mcp server (fastmcp, stdio) — obsidian as claude long-term memory',
  },
  {
    tag: 'build',
    text: 'meridian sage: bm25 + semantic + cross-encoder + gemini synthesis, 249,641 embedded chunks',
  },
  {
    tag: 'build',
    text: 'splitwave: pyannote + whisper-1, speaker diarization cost $5.00 → $0.54',
  },
  {
    tag: 'build',
    text: 'factur2d2: selenium edits the telegram message live while the bot queues the next invoice',
  },
  {
    tag: 'build',
    text: 'velvet stack: next.js + clerk + prisma + supabase + r2 + stripe + mercadopago + upstash + resend + sentry + posthog',
  },
  {
    tag: 'build',
    text: 'varro: vault anchored records repository operations — named after marcus terentius varro (116–27 bc)',
  },
  {
    tag: 'build',
    text: 'silverline design: #0f100e full dark, #5da67a green accent, archivo 900 + literata + geist mono',
  },
  {
    tag: 'build',
    text: 'myobscelium: named after mycelium — the fungal network that passes signals between trees',
  },
  {
    tag: 'build',
    text: 'ghost 148px number cards — rotating conic gradient raf animation, decay factor 0.972',
  },
  {
    tag: 'build',
    text: 'meridian: rate-limit recovery baked into the pipeline — scraper never stops, $0.003/query on gemini vertex ai',
  },
  {
    tag: 'build',
    text: 'splitwave context bloat fix: 400k → 22k tokens, each transcript chunk now fully stateless',
  },
  {
    tag: 'build',
    text: 'velvet phases 1–5: shipped 5 months ahead of the october deadline',
  },
  {
    tag: 'build',
    text: 'ctrl+c×3 changelog — silverline /now page: sword shimmer on section entry',
  },

  // ── SHIPS ─────────────────────────────────────────────────────────────────
  {
    tag: 'ship',
    text: 'velvet mvp: real 1 ars mercadopago payment verified end-to-end, live in production',
  },
  { tag: 'ship', text: 'grill-me v2 · session checkpoint shipped' },
  {
    tag: 'ship',
    text: 'meridian sage: first flagship project public — github.com/ktehllama/meridian-sage-ytkb',
  },
  {
    tag: 'ship',
    text: 'factur2d2: 100+ real afip invoices filed in production, running on raspberry pi 4',
  },
  {
    tag: 'ship',
    text: 'silverline: matheo.guevara.ar — portfolio live, blog pipeline active, /now page shipped',
  },
  {
    tag: 'ship',
    text: 'splitwave github releases v1.0.0: sqlite transcript history, optional num_speakers hint',
  },
  {
    tag: 'ship',
    text: 'velvet transcode migrated: fly.io suspended mid-sprint, cloud run live same day',
  },
  {
    tag: 'ship',
    text: 'task-033: wrote 100% of mercadopago integration blind — developer portal was completely blocked. wired the token later. it worked.',
  },
  {
    tag: 'ship',
    text: 'myobscelium v2: l0 → l1 → full-file tier system, ~500 tokens saved per session start',
  },
  {
    tag: 'ship',
    text: 'velvet aes-128 approved: third-party drm vendor evaluated, shelved — own the stack',
  },

  // ── THINKS ────────────────────────────────────────────────────────────────
  {
    tag: 'think',
    text: '// fly.io had no real free tier. found out when velvet-transcode suspended mid-sprint.',
  },
  {
    tag: 'think',
    text: '// fundamentals before syntax, always',
  },
  {
    tag: 'think',
    text: '// motion is evidence, not decoration',
  },
  {
    tag: 'think',
    text: '// what if the hero is the terminal',
  },
  {
    tag: 'think',
    text: '// the bottleneck was never ideas. the vault is full of material. it was always transformation.',
  },
  {
    tag: 'think',
    text: '// context is the most important currency for ai. myobscelium exists because of that.',
  },
  {
    tag: 'think',
    text: '// mercadopago developer portal was completely blocked. wrote the whole integration blind.',
  },
  {
    tag: 'think',
    text: '// varro v2 final sweep caught a staleness violation in the system built to prevent staleness.',
  },
  {
    tag: 'think',
    text: '// ai amplifies what you already are. supercharges the smart, confirms the lazy.',
  },
  {
    tag: 'think',
    text: '// publish now. a rough post today compounds more than a polished one in three months.',
  },
  {
    tag: 'think',
    text: '// the whole frontend has to be rebuilt from scratch. poisoned codebase problem. that\'s fine.',
  },
  {
    tag: 'think',
    text: '// telegram has a 64-char deep link limit. base64 was impossible. used an in-memory id map instead.',
  },
  {
    tag: 'think',
    text: '// the /now page broke on mobile. dvh → svh. one character. whole page.',
  },
  {
    tag: 'think',
    text: '// storytelling is the sales mechanism. the portfolio works by narrating the build, not pitching credentials.',
  },
  {
    tag: 'think',
    text: '// meridian v5 personal db: check personal layer first. if nothing, fall through to universal.',
  },
  {
    tag: 'think',
    text: '// smart chat naming: tf-idf keyword scorer, no llm, no api call. just math.',
  },
  {
    tag: 'think',
    text: '// the section landing exception was the most aggressive rule in the fingerprint doc. it got revoked.',
  },
  {
    tag: 'think',
    text: '// obsidian graph is starting to look like a crescent moon.',
  },

  // ── NOTES ─────────────────────────────────────────────────────────────────
  {
    tag: 'note',
    text: 'meridian sage: 91 channels, ~5,000 videos, 249,641 embedded chunks, raspberry pi 4 in production',
  },
  {
    tag: 'note',
    text: 'myobscelium graph walk traces wikilinks up to 6 degrees — same idea as six degrees of separation',
  },
  {
    tag: 'note',
    text: 'factur2d2: usdt → ars conversion, invoice queue, and concurrent selenium + telegram edits',
  },
  {
    tag: 'note',
    text: 'velvet design: every gold element is #c4a265. every interaction decision lives in zero-friction ui-ux philosophy.md.',
  },
  {
    tag: 'note',
    text: 'splitwave: optional num_speakers hint, sqlite transcript history, pyinstaller onedir packaging',
  },
  {
    tag: 'note',
    text: 'varro = vault anchored records repository operations. hot → warm → cold → archive. never the reverse.',
  },
  {
    tag: 'note',
    text: 'silverline hero copy: "I make things happen." — took four sessions to land on that.',
  },
  {
    tag: 'note',
    text: 'obsidian git auto-push every 60 minutes — full vault backup after every working session',
  },
  {
    tag: 'note',
    text: 'velvet certificate: server-generated when student passes all exams. revocable state included just in case.',
  },
  {
    tag: 'note',
    text: 'meridian sage renamed from "sage" — "sage felt too ai-generic"',
  },
  {
    tag: 'note',
    text: 'idf scoring + generic tag filtering + same-folder 0.4x penalty — myobscelium surfaces what matters',
  },
  {
    tag: 'note',
    text: 'velvet task-046b: admin analytics now shows real ars amounts. 51k phantom pesos cleared.',
  },
  {
    tag: 'note',
    text: 'ptask-007: 6 sessions, 110+ commits — homepage shipped',
  },
  {
    tag: 'note',
    text: 'obsidian vault: 500+ notes across 6 active projects',
  },
  {
    tag: 'note',
    text: 'meridian sage channels: ycombinator to acquired to andrej karpathy',
  },
  {
    tag: 'note',
    text: 'velvet: every ui decision documented before a single line of code',
  },
];