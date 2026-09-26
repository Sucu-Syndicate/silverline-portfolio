import Hero from '@/components/sections/Hero';
import AboutSkills from '@/components/sections/AboutSkills';
import ProjectsStack from '@/components/sections/ProjectsStack';
import Blog from '@/components/sections/Blog';
import Changelog from '@/components/sections/Changelog';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

export default function Page() {
  return (
    <main>
      <Hero />
      <AboutSkills />
      <ProjectsStack />
      <Blog />
      <Changelog />
      <Contact />
      <Footer />
    </main>
  );
}
