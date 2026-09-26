import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Work from '@/components/sections/Work';
import Blog from '@/components/sections/Blog';
import Changelog from '@/components/sections/Changelog';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Work />
      <Blog />
      <Changelog />
      <Contact />
      <Footer />
    </main>
  );
}
