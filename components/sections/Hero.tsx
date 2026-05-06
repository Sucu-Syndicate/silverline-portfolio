import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex flex-col justify-center min-h-[100dvh] bg-hero-bg overflow-hidden">
      {/* Enhanced grain overlay — 2× base opacity for darker hero texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'var(--grain-url)', opacity: 0.06 }}
      />

      {/* Buenos Aires coordinates — Geist Mono instance 1 of 3 */}
      <span className="absolute top-6 right-8 z-10 font-mono text-[10px] tracking-[0.02em] text-hero-text opacity-40">
        -34.6037, -58.3816
      </span>

      {/* Main content — left-aligned, vertically centered */}
      <div className="relative z-10 px-8 lg:px-16">
        <h1 className="font-archivo font-black leading-none [letter-spacing:-0.03em]">
          <span className="block text-[clamp(56px,9vw,120px)] text-hero-text">
            Mathe Guevara
          </span>
          <span className="block text-[clamp(56px,9vw,120px)] text-accent-dark">
            Builder.
          </span>
        </h1>

        <p className="mt-6 font-archivo font-normal text-[17px] leading-[1.55] max-w-md text-hero-text opacity-70">
          Building things at the intersection of product and code.
        </p>

        <div className="mt-8 flex items-center gap-6 font-archivo font-semibold text-[14px]">
          <a href="#work" className="text-accent-dark">
            See my work →
          </a>
          <Link href="/blog" className="text-hero-text opacity-60">
            Read the blog
          </Link>
        </div>
      </div>

      {/* Gradient mask — fades hero into parchment on scroll */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-parchment))' }}
      />

      {/* Sentinel — observed by Nav to switch between dark/light state */}
      <div id="hero-sentinel" className="absolute bottom-0 left-0 w-full h-px" />
    </section>
  );
}
