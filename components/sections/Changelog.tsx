import ScrollReveal from '@/components/ui/ScrollReveal';

const entries = [
  'Terminal hero restored full-viewport with idle mouse detection',
  '3D stack installed (Three.js, R3F, Rapier) — archived for future embedded demos',
];

export default function Changelog() {
  return (
    <section className="section" id="changelog">
      <ScrollReveal>
        <div className="section-head">
          <div>
            <h2 className="section-title">CHANGELOG</h2>
          </div>
        </div>
      </ScrollReveal>

      <ul className="changelog-list">
        {entries.map((e, i) => (
          <ScrollReveal key={i} delay={i * 0.09}>
            <li className="changelog-item">{e}</li>
          </ScrollReveal>
        ))}
      </ul>
    </section>
  );
}
