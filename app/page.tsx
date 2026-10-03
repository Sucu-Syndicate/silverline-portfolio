import Hero from '@/components/sections/Hero';
import AboutSkills from '@/components/sections/AboutSkills';
import ProjectsStack from '@/components/sections/ProjectsStack';
import Blog from '@/components/sections/Blog';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import FPSCounter from '@/components/ui/FPSCounter';

export default function Page() {
  return (
    <main>
      <Hero />
      <AboutSkills />
      <ProjectsStack />
      <Blog />
      <Contact />
      <Footer />
      <FPSCounter />
    </main>
  );
}
