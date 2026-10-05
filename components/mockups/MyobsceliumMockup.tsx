'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ThoughtLine from '@/components/ui/ThoughtLine';

// ── Code snippets (actual server.py excerpts, trimmed for display) ────────────
const CODE_SEARCH = `pattern = re.compile(
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
  matches = [l for l in
    text.splitlines()
    if pattern.search(l)]
  if matches:
    results.append({"p": rel})`;

const CODE_FIND_RELATED = `for md_file, tags, l0, proj in all_notes:
  shared = (
    target_tags & note_tags
  ) - GENERIC_TAGS
  tag_score = sum(
    1.0 / tag_freq[t] for t in shared
  )
  shared_title = (
    target_words & note_words
  )
  title_score = sum(
    1.0 / title_word_freq.get(w, 1)
    for w in shared_title
  ) * TITLE_WORD_WEIGHT
  score = round(
    tag_score + title_score, 2
  )
results.sort(
  key=lambda x: x["score"],
  reverse=True
)`;

const CODE_GRAPH_WALK = `while queue:
  rel, depth = queue.pop(0)
  if depth >= max_depth: continue
  text = Path(rel).read_text()
  for stem in _parse_wikilinks(text):
    target = _resolve_wikilink(stem)
    if target not in visited:
      visited.add(target)
      queue.append(
        (target, depth + 1)
      )
      nodes[target] = {
        "depth": depth + 1,
        "direction": "out"
      }
return {
  "source": path, "nodes": nodes
}`;

const CODE_LIST_FOLDER = `for md_file in sorted(
  p.rglob("*.md") if recursive
  else p.glob("*.md")
):
  entry = {
    "p": str(
      md_file.relative_to(VAULT_PATH)
    ),
    "m": int(
      md_file.stat().st_mtime * 1000
    )
  }
  if include_preview:
    text = md_file.read_text()
    entry["v"] = text[:PREVIEW_LEN]
  items.append(entry)`;

const CODE_VAULT_OVERVIEW = `for item in sorted(
  VAULT_PATH.rglob("*")
):
  if item.is_dir():
    rel = item.relative_to(VAULT_PATH)
    depth = (
      str(rel).count(sep) + 1
    )
    if depth <= max_depth:
      folders[str(rel)] = (
        _count_md(item)
      )
return {
  "folders": folders,
  "total": sum(folders.values())
}`;

// ── Q&A pairs ─────────────────────────────────────────────────────────────────
interface QAPair {
  question:    string;
  tool:        string;
  args:        string;
  resultCount: number;
  resultLabel: string;
  response:    string;
  graphNodes:  string[];
  code:        string;
}

const QA: QAPair[] = [
  {
    question:    'What did I work on last week?',
    tool:        'obsidian_search',
    args:        '{ "query": "velvet session", "tier": "l0" }',
    resultCount: 7,
    resultLabel: 'notes found',
    response:    'Found 7 notes from last week — Velvet sprint work, two CC session reports, and a design decision on the auth flow.',
    graphNodes:  ['GT — Portfolio', 'TASKS-SL', 'PTASK-008 session', 'Design System', 'silverline-CLAUDE', 'PTASK-007 Polish', 'Contact form'],
    code:        CODE_SEARCH,
  },
  {
    question:    'Find notes related to Silverline',
    tool:        'obsidian_find_related',
    args:        '{ "path": "Silverline/Critical/GT — Portfolio.md", "top_k": 5 }',
    resultCount: 5,
    resultLabel: 'related notes',
    response:    '5 related notes — design system, task board, PTASK-008 report, typography spec, and the ground truth doc.',
    graphNodes:  ['GT — Portfolio', 'Design System', 'TASKS-SL', 'PTASK-008 session', 'Portfolio V2'],
    code:        CODE_FIND_RELATED,
  },
  {
    question:    "Any open decisions I haven't resolved?",
    tool:        'obsidian_search',
    args:        '{ "query": "open decision", "tags": ["decision"] }',
    resultCount: 3,
    resultLabel: 'notes found',
    response:    '3 unresolved — hero headline copy, card corner radius, and a Velvet pricing tier question.',
    graphNodes:  ['Hero headline copy', 'Card corner radius', 'Velvet pricing'],
    code:        CODE_SEARCH,
  },
  {
    question:    'Show me notes that link to my portfolio doc',
    tool:        'obsidian_graph_walk',
    args:        '{ "path": "Silverline/Critical/GT — Portfolio.md", "depth": 2 }',
    resultCount: 4,
    resultLabel: 'connected notes',
    response:    '4 connected notes — TASKS-SL and silverline-CLAUDE link directly, PTASK-008 and Design System are one hop away.',
    graphNodes:  ['GT — Portfolio', 'TASKS-SL', 'silverline-CLAUDE', 'PTASK-008 session'],
    code:        CODE_GRAPH_WALK,
  },
  {
    question:    'List everything in my Silverline folder',
    tool:        'obsidian_list_folder',
    args:        '{ "folder": "Projects/Silverline", "recursive": true }',
    resultCount: 6,
    resultLabel: 'notes',
    response:    '6 notes in Silverline — ground truth, task board, queue, archive, and both design system docs.',
    graphNodes:  ['GT-Portfolio', 'TASKS-SL', 'TASKS-QUEUE', 'TASKS-ARCH', 'DS-Visual', 'DS-Behavior'],
    code:        CODE_LIST_FOLDER,
  },
  {
    question:    "What's in my Projects vault?",
    tool:        'obsidian_vault_overview',
    args:        '{ "mode": "compact", "max_depth": 2 }',
    resultCount: 4,
    resultLabel: 'projects',
    response:    '4 active projects — Silverline portfolio, Velvet course platform, Myobscelium MCP, and an ideas folder with 3 notes.',
    graphNodes:  ['Projects', 'Silverline', 'Velvet', 'Myobscelium'],
    code:        CODE_VAULT_OVERVIEW,
  },
  {
    question:    'Find all my CC session reports',
    tool:        'obsidian_search',
    args:        '{ "query": "session report", "tags": ["cc-output"] }',
    resultCount: 5,
    resultLabel: 'session reports',
    response:    '5 session reports found — 4 for Silverline PTASK-008 and 1 for the Velvet MVP build.',
    graphNodes:  ['PTASK-008 S1', 'PTASK-008 S2', 'PTASK-008 S3', 'PTASK-008 S4', 'Velvet MVP'],
    code:        CODE_SEARCH,
  },
];

// ── Phase type ────────────────────────────────────────────────────────────────
type Phase = 'user-msg' | 'thinking' | 'tool-reveal' | 'graph' | 'response' | 'pause';

const DURATIONS: Record<Phase, number> = {
  'user-msg':    2000,
  'thinking':    3000,
  'tool-reveal': 3500,
  'graph':       2800,
  'response':    3500,
  'pause':        800,
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

// ── Graph layout helpers ──────────────────────────────────────────────────────
function computePositions(count: number): [number, number][] {
  if (count === 0) return [];
  if (count === 1) return [[160, 100]];
  if (count === 2) return [[100, 100], [220, 100]];
  if (count === 3) return [[160, 45], [88, 155], [232, 155]];
  // 4+: index 0 = center, rest = ring
  const positions: [number, number][] = [[160, 100]];
  const n = count - 1;
  const r = count <= 5 ? 68 : count === 6 ? 70 : count <= 7 ? 65 : 60;
  const startAngle = n === 4 ? -Math.PI / 4 : -Math.PI / 2;
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i / n) + startAngle;
    positions.push([
      Math.round(160 + r * Math.cos(angle)),
      Math.round(100 + r * Math.sin(angle)),
    ]);
  }
  return positions;
}

function computeEdges(count: number): [number, number][] {
  if (count <= 1) return [];
  if (count === 2) return [[0, 1]];
  if (count === 3) return [[0, 1], [1, 2], [0, 2]];
  // star: center → all peripheral
  return Array.from({ length: count - 1 }, (_, i) => [0, i + 1] as [number, number]);
}

function edgeLength(a: [number, number], b: [number, number]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

// ── Precomputed graph data (evaluated once at module load, not on each render) ─
interface GraphData {
  positions: [number, number][];
  edges: [number, number][];
  edgeLengths: number[];
  displayLabels: string[];
  rxValues: number[];
  msEach: number;
}

const GRAPH_DATA: GraphData[] = QA.map(qa => {
  const positions    = computePositions(qa.graphNodes.length);
  const edges        = computeEdges(qa.graphNodes.length);
  const edgeLengths  = edges.map(([ai, bi]) => edgeLength(positions[ai], positions[bi]));
  const displayLabels = qa.graphNodes.map(n => n.length > 15 ? n.slice(0, 14) + '…' : n);
  const rxValues     = displayLabels.map(d => Math.max(28, Math.min(52, Math.ceil(d.length * 3.4))));
  const total        = qa.graphNodes.length + edges.length;
  const msEach       = total > 0 ? Math.max(80, Math.min(260, Math.floor(2200 / total))) : 200;
  return { positions, edges, edgeLengths, displayLabels, rxValues, msEach };
});

// ── SVG graph ─────────────────────────────────────────────────────────────────
function NoteGraph({ qaIdx, active, paused }: { qaIdx: number; active: boolean; paused: boolean }) {
  const [drawnNodes, setDrawnNodes] = useState(0);
  const [drawnEdges, setDrawnEdges] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { positions, edges, edgeLengths, displayLabels, rxValues, msEach } = GRAPH_DATA[qaIdx];
  const nodeCount = displayLabels.length;

  useEffect(() => {
    if (!active) { setDrawnNodes(0); setDrawnEdges(0); return; }
    if (paused) return; // freeze without resetting
    let n = 0, e = 0;
    const step = () => {
      if (n < nodeCount) { n++; setDrawnNodes(n); }
      else if (e < edges.length) { e++; setDrawnEdges(e); }
      const done = n >= nodeCount && e >= edges.length;
      if (!done) timerRef.current = setTimeout(step, msEach);
    };
    timerRef.current = setTimeout(step, 120);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused, qaIdx, nodeCount, edges.length, msEach]);

  return (
    <svg viewBox="0 0 320 200" className="myob-graph-svg" aria-hidden="true">
      {edges.slice(0, drawnEdges).map(([ai, bi], idx) => {
        const a = positions[ai], b = positions[bi];
        const len = edgeLengths[idx];
        return (
          <motion.line
            key={idx}
            x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            className="myob-graph-edge"
            strokeDasharray={len}
            initial={{ strokeDashoffset: len }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.35, ease: EXPO }}
          />
        );
      })}
      {displayLabels.slice(0, drawnNodes).map((display, idx) => {
        const [cx, cy] = positions[idx];
        const rx = rxValues[idx];
        return (
          <motion.g
            key={idx}
            className="myob-graph-node-group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: EXPO }}
          >
            <ellipse cx={cx} cy={cy} rx={rx} ry={13} className="myob-graph-node" />
            <text x={cx} y={cy} className="myob-graph-label" dominantBaseline="middle" textAnchor="middle">
              {display}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MyobsceliumMockup({ paused = false }: { paused?: boolean }) {
  const reduce  = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('user-msg');
  const [qaIdx, setQaIdx] = useState(0);
  const phaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const qa = QA[qaIdx];

  useEffect(() => {
    if (reduce || paused) return;
    const advance = () => {
      setPhase(prev => {
        const nextIdx = (PHASE_ORDER.indexOf(prev) + 1) % PHASE_ORDER.length;
        const next = PHASE_ORDER[nextIdx];
        if (next === 'user-msg') setQaIdx(i => (i + 1) % QA.length);
        return next;
      });
    };
    phaseRef.current = setTimeout(advance, DURATIONS[phase]);
    return () => { if (phaseRef.current) clearTimeout(phaseRef.current); };
  }, [phase, reduce, paused]);

  const inChat         = phase === 'user-msg' || phase === 'thinking' || phase === 'response' || phase === 'pause';
  const inBehindScenes = phase === 'tool-reveal' || phase === 'graph';

  const typedQuestion = useTypedText(qa.question, phase !== 'pause', 100);
  const typedResponse = useTypedText(qa.response, phase === 'response', 400);

  // Static fallback
  if (reduce) {
    const s = QA[0];
    return (
      <div className="myob-mockup myob-mockup--static">
        <div className="myob-chat-header">
          <span className="myob-chat-model">claude-sonnet-5</span>
          <span className="myob-chat-badge">MCP · Obsidian</span>
        </div>
        <div className="myob-chat-body">
          <div className="myob-bubble myob-bubble--user">{s.question}</div>
          <div className="myob-tool-badge"><span className="myob-tool-name">{s.tool}</span></div>
          <div className="myob-bubble myob-bubble--ai">{s.response}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="myob-mockup">
      <div className="myob-chat-header">
        <span className="myob-chat-model">claude-sonnet-5</span>
        <span className="myob-chat-badge">MCP · Obsidian</span>
      </div>

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
              <AnimatePresence>
                {phase !== 'pause' && (
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
                    <div className="myob-tool-call-header">
                      <span className="myob-tool-call-label">tool_call</span>
                      <span className="myob-tool-call-name">{qa.tool}</span>
                    </div>
                    <div className="myob-tool-args">
                      <span className="myob-tool-args-key">args</span>
                      <span className="myob-tool-args-val">{qa.args}</span>
                    </div>
                    <div className="myob-code-block">
                      <div className="myob-code-filename">server.py</div>
                      <pre className="myob-code-pre"><code>{qa.code}</code></pre>
                    </div>
                    <motion.div
                      className="myob-result-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.4 }}
                    >
                      <span className="myob-result-icon">✓</span>
                      <span className="myob-result-text">
                        {qa.resultCount} {qa.resultLabel}
                      </span>
                    </motion.div>
                  </motion.div>
                )}

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
                      <span className="myob-graph-label-text">
                        Vault graph · {qa.resultCount} {qa.resultLabel}
                      </span>
                    </div>
                    <NoteGraph qaIdx={qaIdx} active={phase === 'graph'} paused={paused} />
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
