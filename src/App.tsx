import { useTheme } from '@/hooks/useTheme';
import { NeuralBackground } from '@/components/NeuralBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';

const containerClass = 'mx-auto w-full max-w-[1480px] px-6 md:px-12 py-24 md:py-32 scroll-mt-24';

const App = () => {
  const { mode, toggle, colorblind, toggleColorblind } = useTheme();

  return (
    <>
      <NeuralBackground />
      <div className="bg-layer" aria-hidden="true">
        <span className="blob-a" />
        <span className="blob-b" />
        <span className="blob-c" />
      </div>

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
        <section id="contact" className={containerClass}>
          <Contact />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default App;
