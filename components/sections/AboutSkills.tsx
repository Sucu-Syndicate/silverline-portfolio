import ScrollReveal from '@/components/ui/ScrollReveal';

const demonstrated = ['Python', 'Power Automate', 'HTML / CSS'];
const building = ['React', 'Next.js'];

export default function AboutSkills() {
  return (
    <section className="section" id="about">
      <ScrollReveal>
        <div className="section-head">
          <div>
            <p className="section-label">About</p>
            <h2 className="section-title">ABOUT</h2>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <p className="about-text">
          CS student in Buenos Aires. Spent two years shipping products solo, using AI as
          a co-pilot, not a crutch. Every project here was directed, debugged, and deployed by
          me. Currently building Velvet, an AI-native financial platform, from architecture to
          deployment.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.16}>
        <div className="skills-block">
          <p className="skills-sublabel">Demonstrated</p>
          <div className="skills-pills">
            {demonstrated.map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.22}>
        <div className="skills-block">
          <p className="skills-sublabel">Currently Building</p>
          <div className="skills-pills">
            {building.map((s) => (
              <span key={s} className="skill-pill skill-pill--wip">{s}</span>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
