const entries = [
  'Terminal hero restored full-viewport with idle mouse detection',
  '3D stack installed (Three.js, R3F, Rapier) — archived for future embedded demos',
];

export default function Changelog() {
  return (
    <section className="section" id="changelog">
      <div className="section-head">
        <div>
          <p className="section-label">Changelog</p>
          <h2 className="section-title">CHANGELOG</h2>
        </div>
      </div>

      <ul className="changelog-list">
        {entries.map((e, i) => (
          <li key={i} className="changelog-item">{e}</li>
        ))}
      </ul>
    </section>
  );
}
