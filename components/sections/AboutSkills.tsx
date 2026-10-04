import ScrollReveal from '@/components/ui/ScrollReveal';
import PhysicsBadges from '@/components/ui/PhysicsBadges';

export default function AboutSkills() {
  return (
    <section className="section section--about" id="about">
      <ScrollReveal>
        <div className="section-head">
          <div>
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

      <ScrollReveal delay={0.14}>
        <div className="stack-block">
          <h2 className="section-title">STACK</h2>
          <p className="about-text">The tools in my core stack and tech I&apos;ve used across projects.</p>
        </div>
      </ScrollReveal>

      <PhysicsBadges />
    </section>
  );
}
