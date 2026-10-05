'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

// ── Scenario data (no PII — no real CUITs, no real credentials) ───────────────
interface Scenario {
  amount:   string;
  type:     'Factura B' | 'Factura C';
  cae:      string;
  desc:     string;     // service description shown in success message
  showMenu: boolean;
  startMs:  number;
}

const SCENARIOS: Scenario[] = [
  { amount: '$85.000',  type: 'Factura B', cae: '74008765432198', desc: 'Development services',  showMenu: false, startMs: 2400 },
  { amount: '$120.000', type: 'Factura B', cae: '74009123456781', desc: 'Technical consulting',    showMenu: true,  startMs: 3400 },
  { amount: '$52.500',  type: 'Factura C', cae: '74007654321987', desc: 'Support & maintenance',  showMenu: false, startMs: 2400 },
];

// ── Code steps (arca-crypto-pi.py function names — no credentials) ─────────────
const CODE_STEPS: string[] = [
  'def create_factura(upd, ctx):',
  'selenium_main(amounts, cb)',
  'stealth(driver, lang="es")',
  'cuit_input.send_keys(CUIT)',
  'btnSiguiente.click()',
  'WebDriverWait → price field',
  'price.send_keys(money_amt)',
  'desc.send_keys(rand_desc)',
  'confirm_button.click()',
  'alert.accept()  # CAE ✓',
];

// ── Step → telegram message ────────────────────────────────────────────────────
const TG_STEP_MSGS: string[] = [
  '🤖 Starting automation...',
  '🔧 Selenium driver initialized',
  '🌐 Login page loaded successfully',
  '🔢 Credentials entered',
  '🔑 Login submitted',
  '✅ Login completed successfully',
  '',   // filled dynamically with scenario.amount
  '📝 Description filled in',
  '🖱️ Submitting...',
  '✅🎉 Factura generated successfully!',
];

function getTgMsg(step: number, scenario: Scenario): string {
  if (step === 6) return `💵 Amount: ${scenario.amount} entered`;
  return TG_STEP_MSGS[step] ?? '';
}

// ── Bot commands (only these exist) ───────────────────────────────────────────
const BOT_MENU = [
  { cmd: '/menu',   desc: 'Show this menu'       },
  { cmd: '/create', desc: 'Issue new invoice'    },
  { cmd: '/setcat', desc: 'Set invoice category' },
];

// ── Easing ────────────────────────────────────────────────────────────────────
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Phase ─────────────────────────────────────────────────────────────────────
type OuterPhase = 'telegram-start' | 'split' | 'telegram-done' | 'pause';

// ── TgHeader ──────────────────────────────────────────────────────────────────
function TgHeader() {
  return (
    <div className="factur-tg-header">
      <div className="factur-tg-header-left">
        <div className="factur-tg-avatar">F2</div>
        <div>
          <div className="factur-tg-botname">Factur2d2</div>
          <div className="factur-tg-status">
            <span className="factur-tg-dot" />
            online
          </div>
        </div>
      </div>
      <span className="factur-tg-badge">BOT</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Factur2d2Mockup({ paused = false }: { paused?: boolean }) {
  const reduce = useReducedMotion();

  const [outerPhase, setOuterPhase]   = useState<OuterPhase>('telegram-start');
  const [step, setStep]               = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const timerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeStepRef     = useRef<HTMLDivElement | null>(null);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);

  const scenario = SCENARIOS[scenarioIdx];
  const isSplit  = outerPhase === 'split';

  // Derived: visible telegram status messages (grows as step advances during split)
  const visibleTgMsgs: string[] = isSplit
    ? Array.from({ length: step + 1 }, (_, i) => getTgMsg(i, scenario)).filter(Boolean)
    : [];

  // Phase advancement
  useEffect(() => {
    if (reduce || paused) return;

    if (outerPhase === 'telegram-start') {
      timerRef.current = setTimeout(() => {
        setStep(0);
        setOuterPhase('split');
      }, scenario.startMs);
    } else if (outerPhase === 'split') {
      timerRef.current = setTimeout(() => {
        if (step < CODE_STEPS.length - 1) {
          setStep(s => s + 1);
        } else {
          setOuterPhase('telegram-done');
        }
      }, 700);
    } else if (outerPhase === 'telegram-done') {
      timerRef.current = setTimeout(() => setOuterPhase('pause'), 2800);
    } else {
      // pause
      timerRef.current = setTimeout(() => {
        setScenarioIdx(i => (i + 1) % SCENARIOS.length);
        setStep(0);
        setOuterPhase('telegram-start');
      }, 700);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [outerPhase, step, paused, reduce, scenario.startMs]);

  // Auto-scroll code panel to keep active step in view
  useEffect(() => {
    if (!isSplit || !activeStepRef.current || !stepsContainerRef.current) return;
    const container = stepsContainerRef.current;
    const el        = activeStepRef.current;
    const targetTop = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  }, [step, isSplit]);

  // Static fallback
  if (reduce) {
    return (
      <div className="factur-mockup factur-mockup--static">
        <TgHeader />
        <div className="factur-static-body">
          <div className="factur-bubble factur-bubble--user">/create</div>
          <div className="factur-bubble factur-bubble--bot">
            ✅ Factura B created — CAE: 74008765432198 · $85.000
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="factur-mockup">
      <TgHeader />
      <div className="factur-body">

        {/* Telegram pane */}
        <motion.div
          className="factur-tg-pane"
          animate={{ width: isSplit ? '50%' : '100%' }}
          transition={{ duration: 0.5, ease: EXPO }}
        >
          <div className="factur-tg-wrap">
          <AnimatePresence mode="wait">

            {/* Phase: telegram-start */}
            {outerPhase === 'telegram-start' && (
              <motion.div
                key="tg-start"
                className="factur-tg-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.35, ease: EXPO }}
              >
                {/* Variant: show menu first */}
                {scenario.showMenu && (
                  <motion.div
                    className="factur-bubble factur-bubble--bot"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: EXPO, delay: 0.1 }}
                  >
                    <div className="factur-menu-title">Available commands</div>
                    {BOT_MENU.map(item => (
                      <div key={item.cmd} className="factur-menu-row">
                        <span className="factur-menu-cmd">{item.cmd}</span>
                        <span className="factur-menu-desc">{item.desc}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* User sends /create */}
                <motion.div
                  className="factur-bubble factur-bubble--user"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: EXPO, delay: scenario.showMenu ? 0.9 : 0.2 }}
                >
                  /create
                </motion.div>

                {/* Bot: keyboard with amounts */}
                <motion.div
                  className="factur-bubble factur-bubble--bot"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: EXPO, delay: scenario.showMenu ? 1.5 : 0.65 }}
                >
                  🧾 <strong>{scenario.type}</strong> — Select amount:
                  <div className="factur-inline-kbd">
                    {SCENARIOS.map((s, i) => (
                      <motion.span
                        key={s.amount}
                        className={`factur-inline-btn${i === scenarioIdx ? ' factur-inline-btn--selected' : ''}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          ease: EXPO,
                          delay: (scenario.showMenu ? 1.7 : 0.85) + i * 0.07,
                        }}
                      >
                        {s.amount}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Phase: split — telegram status feed */}
            {outerPhase === 'split' && (
              <motion.div
                key="tg-split"
                className="factur-tg-body factur-tg-body--split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EXPO }}
              >
                {visibleTgMsgs.map((msg, i) => (
                  <motion.div
                    key={i}
                    className="factur-status-msg"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: EXPO }}
                  >
                    {msg}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Phase: telegram-done / pause — real bot success message format */}
            {(outerPhase === 'telegram-done' || outerPhase === 'pause') && (
              <motion.div
                key="tg-done"
                className="factur-tg-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EXPO }}
              >
                <div className="factur-bubble factur-bubble--bot">
                  <div className="factur-done-header">🧾 Factura Creation Completed:</div>
                  <div className="factur-done-stats">
                    <div>✅ <strong>1</strong> transaction(s) successfull</div>
                    <div className="factur-done-time">
                      🕐 Created at: <strong>05/10/2026 14:23:47</strong>
                    </div>
                  </div>
                  <div className="factur-done-item">
                    ‣ 🧾 Factura{' '}
                    <strong>{scenario.amount}</strong>{' '}
                    / <strong>{scenario.desc}</strong> successful
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          </div>
        </motion.div>

        {/* Code pane — slides in when split */}
        <AnimatePresence>
          {isSplit && (
            <motion.div
              className="factur-code-pane"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.4, ease: EXPO }}
            >
              <div className="factur-code-header">
                <span className="factur-code-filename">arca-crypto-pi.py</span>
              </div>
              <div ref={stepsContainerRef} className="factur-code-steps">
                {CODE_STEPS.map((code, i) => (
                  <div
                    key={i}
                    ref={i === step ? activeStepRef : undefined}
                    className={`factur-code-step${i === step ? ' factur-code-step--active' : ''}`}
                  >
                    <code className="factur-code-pre">{code}</code>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
