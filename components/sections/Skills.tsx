const demonstrated = ['Python', 'Power Automate', 'HTML / CSS'];
const building = ['React', 'Next.js'];

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section-head">
        <div>
          <p className="section-label">Skills</p>
          <h2 className="section-title">SKILLS</h2>
        </div>
      </div>

      <div className="skills-block">
        <p className="skills-sublabel">Demonstrated</p>
        <div className="skills-pills">
          {demonstrated.map((s) => (
            <span key={s} className="skill-pill">{s}</span>
          ))}
        </div>
      </div>

      <div className="skills-block">
        <p className="skills-sublabel">Currently Building</p>
        <div className="skills-pills">
          {building.map((s) => (
            <span key={s} className="skill-pill skill-pill--wip">{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
