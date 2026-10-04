import ScrollReveal from '@/components/ui/ScrollReveal';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-head">
        <div>
          <h2 className="section-title">ABOUT</h2>
        </div>
      </div>
      <ScrollReveal>
        <p className="about-text">
          CS student in Buenos Aires. Spent two years shipping products solo, using AI as
          a co-pilot, not a crutch. Every project here was directed, debugged, and deployed by
          me. Currently building Velvet, an AI-native financial platform, from architecture to
          deployment.
        </p>
      </ScrollReveal>
    </section>
  );
}
