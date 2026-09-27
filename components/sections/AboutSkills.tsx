import ScrollReveal from '@/components/ui/ScrollReveal';
import PhysicsBadges from '@/components/ui/PhysicsBadges';

export default function AboutSkills() {
  return (
    <section className="section section--about" id="about">
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

      <div className="badges-caption" aria-hidden="true">
        <span className="badges-caption-text"><strong>Core stack</strong> — things I know well</span>
        <span className="badges-caption-text">tech I&apos;ve used in projects</span>
      </div>

      <PhysicsBadges />
    </section>
  );
}
