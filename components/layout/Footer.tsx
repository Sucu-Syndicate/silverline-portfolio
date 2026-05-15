'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [ts, setTs] = useState('');
  useEffect(() => {
    setTs(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-mark">
          matheog<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>
        <div className="footer-meta">
          <div>
            <a href="mailto:teh.dsc@gmail.com">teh.dsc@gmail.com</a>
          </div>
          <div>
            <a href="https://github.com/ktehllama" target="_blank" rel="noreferrer">
              github / Matheo
            </a>
          </div>
          <div>
            <a href="https://www.linkedin.com/in/matheoguevara/" target="_blank" rel="noreferrer">
              linkedin / Matheo
            </a>
          </div>
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
