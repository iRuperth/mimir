import { useTheme } from '@/hooks/useTheme';
import { GlassTuningProvider } from '@/hooks/useGlassTuning';
import { NeuralBackground } from '@/components/NeuralBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Guestbook } from '@/components/sections/Guestbook';
import { GlassTuner } from '@/components/glass/GlassTuner';
import { ScrollFade } from '@/components/motion/ScrollFade';
import { config } from '@/config/env';

const containerClass = 'mx-auto w-[92%] max-w-[1800px] py-24 md:py-32 scroll-mt-24';

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
          <ScrollFade>
            <About />
          </ScrollFade>
        </section>
        <section
          id="projects"
          className={`${containerClass} md:px-44 lg:px-52 xl:px-56`}
        >
          <Projects />
        </section>
        <section id="skills" className={containerClass}>
          <ScrollFade>
            <Skills />
          </ScrollFade>
        </section>
        {config.guestbook.enabled && (
          <section id="guestbook" className={containerClass}>
            <ScrollFade>
              <Guestbook />
            </ScrollFade>
          </section>
        )}
      </main>

      <Footer />
      {config.devTools.glassTuner && <GlassTuner />}
    </GlassTuningProvider>
  );
};

export default App;
