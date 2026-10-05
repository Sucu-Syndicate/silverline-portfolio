'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

// ── Invoice loop data ──────────────────────────────────────────────────────────
interface Invoice { amount: string; cae: string; }

const INVOICES: Invoice[] = [
  { amount: '$85.000',  cae: '74008765432198' },
  { amount: '$120.000', cae: '74009123456781' },
  { amount: '$52.500',  cae: '74007654321987' },
];

// ── Code steps (real arca-crypto-pi.py excerpts, trimmed for display) ─────────
const CODE_STEPS: string[] = [
  '@authorized_only async def create_factura(...)',
  'await arca_cypto_selenium_main(amounts, cb)',
  'stealth(driver, languages=["es"], platform="Win32")',
  'cuit_input.send_keys(\'20275666344\')',
  'driver.find_element(By.ID, "F1:btnSiguiente").click()',
  'WebDriverWait(10).until(EC.visibility_of_element(...))',
  'price.send_keys(money_amt)',
  'desc.send_keys(rand_desc)',
  'confirm_button.click()',
  'driver.switch_to.alert.accept()',
];

// ── Step → telegram message ────────────────────────────────────────────────────
const TG_STEP_MSGS: string[] = [
  '🤖 Starting automation...',
  '🔧 Selenium driver initialized',
  '🌐 Navigating to ARCA login...',
  '🔢 CUIT entered into login page',
  '🔑 Credentials submitted',
  '✅ Logged in, opening invoice form',
  '',   // filled dynamically with invoice.amount
  '📝 Description filled in',
  '🖱️ Submitting invoice...',
  '',   // filled dynamically with invoice.cae
];

function getTgMsg(step: number, invoice: Invoice): string {
  if (step === 6) return `💵 Amount: ${invoice.amount} entered`;
  if (step === 9) return `✅ CAE: ${invoice.cae}`;
  return TG_STEP_MSGS[step] ?? '';
}

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

  const [outerPhase, setOuterPhase] = useState<OuterPhase>('telegram-start');
  const [step, setStep]             = useState(0);
  const [invoiceIdx, setInvoiceIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const invoice = INVOICES[invoiceIdx];
  const isSplit = outerPhase === 'split';

  // Derived: visible telegram status messages (grows as step advances during split)
  const visibleTgMsgs: string[] = isSplit
    ? Array.from({ length: step + 1 }, (_, i) => getTgMsg(i, invoice)).filter(Boolean)
    : [];

  useEffect(() => {
    if (reduce || paused) return;

    if (outerPhase === 'telegram-start') {
      timerRef.current = setTimeout(() => {
        setStep(0);
        setOuterPhase('split');
      }, 2200);
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
        setInvoiceIdx(i => (i + 1) % INVOICES.length);
        setStep(0);
        setOuterPhase('telegram-start');
      }, 700);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [outerPhase, step, paused, reduce]);

  // Static fallback
  if (reduce) {
    return (
      <div className="factur-mockup factur-mockup--static">
        <TgHeader />
        <div className="factur-static-body">
          <div className="factur-bubble factur-bubble--user">/createfactura</div>
          <div className="factur-bubble factur-bubble--bot">
            ✅ Factura B created — CAE: 74008765432198 · Amount: $85.000
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="factur-mockup">
      <TgHeader />
      <div className="factur-body">

        {/* Telegram pane — animates its width when split */}
        <motion.div
          className="factur-tg-pane"
          animate={{ width: isSplit ? '55%' : '100%' }}
          transition={{ duration: 0.5, ease: EXPO }}
        >
          <div className="factur-tg-wrap">
          <AnimatePresence mode="wait">

            {/* Phase: telegram-start — /createfactura exchange + inline keyboard */}
            {outerPhase === 'telegram-start' && (
              <motion.div
                key="tg-start"
                className="factur-tg-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.35, ease: EXPO }}
              >
                <motion.div
                  className="factur-bubble factur-bubble--user"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EXPO }}
                >
                  /createfactura
                </motion.div>
                <motion.div
                  className="factur-bubble factur-bubble--bot"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EXPO, delay: 0.35 }}
                >
                  🧾 <strong>Create Factura</strong>
                  <br />
                  Select an amount:
                  <div className="factur-inline-kbd">
                    {INVOICES.map((inv, i) => (
                      <motion.span
                        key={inv.amount}
                        className={`factur-inline-btn${i === invoiceIdx ? ' factur-inline-btn--selected' : ''}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.22, ease: EXPO, delay: 0.55 + i * 0.08 }}
                      >
                        {inv.amount}
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

            {/* Phase: telegram-done / pause — success card */}
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
                  <div className="factur-done-card">
                    <div className="factur-done-title">✅ Factura B created</div>
                    <div className="factur-done-row">
                      <span className="factur-done-label">CAE</span>
                      <span className="factur-done-value">{invoice.cae}</span>
                    </div>
                    <div className="factur-done-row">
                      <span className="factur-done-label">Amount</span>
                      <span className="factur-done-value">{invoice.amount}</span>
                    </div>
                    <div className="factur-done-row">
                      <span className="factur-done-label">Venc. CAE</span>
                      <span className="factur-done-value">15/10/2026</span>
                    </div>
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
              <div className="factur-code-steps">
                {CODE_STEPS.map((code, i) => (
                  <div
                    key={i}
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
