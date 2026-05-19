import { useTheme } from '@/hooks/useTheme';
import { GlassTuningProvider } from '@/hooks/useGlassTuning';
import { NeuralBackground } from '@/components/NeuralBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { GlassTuner } from '@/components/glass/GlassTuner';

const containerClass = 'mx-auto w-full max-w-[1480px] px-6 md:px-12 py-24 md:py-32 scroll-mt-24';

const App = () => {
  const { mode, toggle, colorblind, toggleColorblind } = useTheme();

  return (
    <GlassTuningProvider>
      <NeuralBackground />
      <div className="bg-layer" aria-hidden="true">
        <span className="blob-a" />
        <span className="blob-b" />
        <span className="blob-c" />
      </div>

      <div className="top-fade" aria-hidden="true" />

      <Navbar
        mode={mode}
        onThemeToggle={toggle}
        colorblind={colorblind}
        onColorblindToggle={toggleColorblind}
      />

      <main>
        <Hero />
        <section id="about" className={containerClass}>
          <About />
        </section>
        <section id="projects" className={containerClass}>
          <Projects />
        </section>
        <section id="skills" className={containerClass}>
          <Skills />
        </section>
        <section id="contact" className={containerClass}>
          <Contact />
        </section>
      </main>

      <Footer />
      <GlassTuner />
    </GlassTuningProvider>
  );
};

export default App;
