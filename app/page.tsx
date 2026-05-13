import Hero from '@/components/sections/Hero';
import WipBand from '@/components/sections/WipBand';
import Projects from '@/components/sections/Projects';
import NowTeaser from '@/components/sections/NowTeaser';
import Footer from '@/components/layout/Footer';
import EasterEggs from '@/components/ui/EasterEggs';

export default function Page() {
  return (
    <>
      <Hero />
      <WipBand />
      <Projects />
      <NowTeaser />
      <Footer />
      <EasterEggs />
    </>
  );
}
