'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ThoughtLine from '@/components/ui/ThoughtLine';

// ── Q&A pairs ─────────────────────────────────────────────────────────────────
const QA = [
  {
    question:    'What did I work on last week?',
    tool:        'obsidian_search',
    args:        '{ "query": "velvet session", "tier": "l0" }',
    resultCount: 7,
    response:    'Found 7 notes from last week — Velvet sprint work, two CC session reports, and a design decision on the auth flow.',
  },
  {
    question:    'Find notes related to Silverline',
    tool:        'obsidian_find_related',
    args:        '{ "path": "Projects/Silverline/Critical/GT — Portfolio.md", "top_k": 5 }',
    resultCount: 5,
    response:    '5 related notes — design system, task board, PTASK-008 report, typography spec, ground truth doc.',
  },
  {
    question:    "Any open decisions I haven't resolved?",
    tool:        'obsidian_search',
    args:        '{ "query": "open decision", "tags": ["decision"] }',
    resultCount: 3,
    response:    '3 unresolved — hero headline copy, card corner radius, and a Velvet pricing tier question.',
  },
] as const;

// ── Code snippet (actual server.py excerpt, trimmed) ─────────────────────────
const CODE_SNIPPET = `pattern = re.compile(
  re.escape(query), flags
)
for md_file in sorted(
  root.rglob("*.md")
):
  if scanned >= max_scan: break
  if tags:
    fm = _parse_frontmatter(md_file)
    if not any(t in fm.get(
      "tags",[]
    ) for t in tags): continue
  matches = [
    l for l in text.splitlines()
    if pattern.search(l)
  ]
  if matches:
    results.append({
      "p": rel, "matches": matches
    })`;

// ── Graph node/edge data ──────────────────────────────────────────────────────
// ViewBox 320×200, nodes as [cx, cy, label]
const NODES: [number, number, string][] = [
  [ 50, 40,  'GT — Portfolio.md'       ],
  [240, 35,  'Design System — Visual.md'],
  [160, 100, 'silverline-CLAUDE.md'    ],
  [ 55, 165, 'TASKS-SL.md'            ],
  [268, 160, 'PTASK-008 session.md'   ],
];
const EDGES: [number, number][] = [
  [0, 2], [1, 2], [2, 3], [2, 4], [3, 4],
];

// ── Phase type ────────────────────────────────────────────────────────────────
type Phase = 'user-msg' | 'thinking' | 'tool-reveal' | 'graph' | 'response' | 'pause';

// Phase durations in ms
const DURATIONS: Record<Phase, number> = {
  'user-msg':   2000,
  'thinking':   3000,
  'tool-reveal':3500,
  'graph':      2500,
  'response':   3200,
  'pause':       800,
};
const PHASE_ORDER: Phase[] = ['user-msg', 'thinking', 'tool-reveal', 'graph', 'response', 'pause'];

// ── Easing ────────────────────────────────────────────────────────────────────
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Word-by-word typing ───────────────────────────────────────────────────────
function useTypedText(text: string, active: boolean, delay = 0) {
  const [visible, setVisible] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) { setVisible(''); return; }
    const words = text.split(' ');
    let i = 0;
    const tick = () => {
      i++;
      setVisible(words.slice(0, i).join(' '));
      if (i < words.length) timerRef.current = setTimeout(tick, 80);
    };
    timerRef.current = setTimeout(tick, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, text, delay]);

  return visible;
}

// ── Edge length helper ────────────────────────────────────────────────────────
function edgeLength(a: [number, number, string], b: [number, number, string]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

// ── SVG graph ─────────────────────────────────────────────────────────────────
function NoteGraph({ active }: { active: boolean }) {
  const [drawnEdges, setDrawnEdges] = useState(0);
  const [drawnNodes, setDrawnNodes] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      setDrawnEdges(0);
      setDrawnNodes(0);
      return;
    }
    let n = 0, e = 0;
    const drawNext = () => {
      if (n < NODES.length) {
        n++;
        setDrawnNodes(n);
        timerRef.current = setTimeout(drawNext, 200);
      } else if (e < EDGES.length) {
        e++;
        setDrawnEdges(e);
        timerRef.current = setTimeout(drawNext, 280);
      }
    };
    timerRef.current = setTimeout(drawNext, 150);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  return (
    <svg
      viewBox="0 0 320 200"
      className="myob-graph-svg"
      aria-hidden="true"
    >
      {/* Edges — motion.line animates strokeDashoffset from actual length → 0 */}
      {EDGES.slice(0, drawnEdges).map(([ai, bi], idx) => {
        const a = NODES[ai], b = NODES[bi];
        const len = edgeLength(a, b);
        return (
          <motion.line
            key={idx}
            x1={a[0]} y1={a[1]}
            x2={b[0]} y2={b[1]}
            className="myob-graph-edge"
            strokeDasharray={len}
            initial={{ strokeDashoffset: len }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.4, ease: EXPO }}
          />
        );
      })}
      {/* Nodes */}
      {NODES.slice(0, drawnNodes).map(([cx, cy, label], idx) => (
        <motion.g
          key={idx}
          className="myob-graph-node-group"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: EXPO }}
        >
          <ellipse
            cx={cx} cy={cy}
            rx={label.length > 18 ? 52 : 44}
            ry={13}
            className="myob-graph-node"
          />
          <text
            x={cx} y={cy}
            className="myob-graph-label"
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {label.replace('.md', '')}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MyobsceliumMockup() {
  const reduce  = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('user-msg');
  const [qaIdx, setQaIdx] = useState(0);
  const phaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const qa = QA[qaIdx];

  // Advance phase on a timer
  useEffect(() => {
    if (reduce) return;
    const advance = () => {
      setPhase(prev => {
        const nextIdx = (PHASE_ORDER.indexOf(prev) + 1) % PHASE_ORDER.length;
        const next = PHASE_ORDER[nextIdx];
        if (next === 'user-msg') {
          // pick next QA pair on loop restart
          setQaIdx(i => (i + 1) % QA.length);
        }
        return next;
      });
    };
    phaseRef.current = setTimeout(advance, DURATIONS[phase]);
    return () => { if (phaseRef.current) clearTimeout(phaseRef.current); };
  }, [phase, reduce]);

  const inChat         = phase === 'user-msg' || phase === 'thinking' || phase === 'response' || phase === 'pause';
  const inBehindScenes = phase === 'tool-reveal' || phase === 'graph';

  const userVisible    = phase !== 'pause' || true; // always visible once shown
  const typedQuestion  = useTypedText(qa.question, phase === 'user-msg' || phase === 'thinking' || phase === 'response', 100);
  const typedResponse  = useTypedText(qa.response, phase === 'response', 400);

  // Static fallback for reduced-motion
  if (reduce) {
    const staticQa = QA[0];
    return (
      <div className="myob-mockup myob-mockup--static">
        <div className="myob-chat-header">
          <span className="myob-chat-model">claude-sonnet-5</span>
          <span className="myob-chat-badge">MCP</span>
        </div>
        <div className="myob-chat-body">
          <div className="myob-bubble myob-bubble--user">{staticQa.question}</div>
          <div className="myob-tool-badge">
            <span className="myob-tool-name">{staticQa.tool}</span>
          </div>
          <div className="myob-bubble myob-bubble--ai">{staticQa.response}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="myob-mockup">
      {/* Header */}
      <div className="myob-chat-header">
        <span className="myob-chat-model">claude-sonnet-5</span>
        <span className="myob-chat-badge">MCP · Obsidian</span>
      </div>

      {/* Body — animated between chat and behind-scenes */}
      <div className="myob-body-wrap">
        <AnimatePresence mode="wait">
          {/* CHAT VIEW */}
          {inChat && (
            <motion.div
              key="chat"
              className="myob-chat-body"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EXPO }}
            >
              {/* User bubble */}
              <AnimatePresence>
                {(phase !== 'pause') && (
                  <motion.div
                    key="q"
                    className="myob-bubble myob-bubble--user"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EXPO }}
                  >
                    {typedQuestion || '\u00a0'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ThoughtLine — shown in thinking phase */}
              <AnimatePresence>
                {phase === 'thinking' && (
                  <motion.div
                    key="thinking"
                    className="myob-thinking-row"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EXPO }}
                  >
                    <ThoughtLine
                      label="Searching vault…"
                      working={true}
                      collapsible={false}
                      showTimer={false}
                      shimmer={true}
                      fontSize={13}
                      color="rgba(196, 181, 253, 0.95)"
                      glyphColor="rgba(196, 181, 253, 0.95)"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI response bubble */}
              <AnimatePresence>
                {phase === 'response' && (
                  <motion.div
                    key="resp"
                    className="myob-bubble myob-bubble--ai"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EXPO, delay: 0.2 }}
                  >
                    {typedResponse || '\u00a0'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* BEHIND-SCENES VIEW */}
          {inBehindScenes && (
            <motion.div
              key="behind"
              className="myob-behind"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.4, ease: EXPO }}
            >
              {/* Tool reveal */}
              <AnimatePresence mode="wait">
                {phase === 'tool-reveal' && (
                  <motion.div
                    key="tool"
                    className="myob-tool-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Tool call header */}
                    <div className="myob-tool-call-header">
                      <span className="myob-tool-call-label">tool_call</span>
                      <span className="myob-tool-call-name">{qa.tool}</span>
                    </div>
                    {/* Args */}
                    <div className="myob-tool-args">
                      <span className="myob-tool-args-key">args</span>
                      <span className="myob-tool-args-val">{qa.args}</span>
                    </div>
                    {/* Code block */}
                    <div className="myob-code-block">
                      <div className="myob-code-filename">server.py</div>
                      <pre className="myob-code-pre"><code>{CODE_SNIPPET}</code></pre>
                    </div>
                    {/* Result count */}
                    <motion.div
                      className="myob-result-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.4 }}
                    >
                      <span className="myob-result-icon" aria-hidden="true">✓</span>
                      <span className="myob-result-text">
                        {qa.resultCount} notes found
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Graph */}
                {phase === 'graph' && (
                  <motion.div
                    key="graph"
                    className="myob-graph-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="myob-graph-header">
                      <span className="myob-graph-label-text">Vault graph · {qa.resultCount} matches</span>
                    </div>
                    <NoteGraph active={phase === 'graph'} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
