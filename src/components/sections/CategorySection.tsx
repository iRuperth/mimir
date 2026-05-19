import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ProjectGridCard } from '@/components/project/ProjectGridCard';
import { ProjectModal } from '@/components/project/ProjectModal';
import { localizedCategory, skillsForCategory } from '@/config/projects';
import type { CategoryDef, ProjectDef } from '@/config/projects';

interface Props {
  category: CategoryDef;
  projects: ProjectDef[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export const CategorySection = ({ category, projects: items }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const c = localizedCategory(category, lang);
  const skills = skillsForCategory(category.id);
  const [selected, setSelected] = useState<ProjectDef | null>(null);
  const ref = useRef<HTMLElement>(null);

  /* Toggle body class while a project modal is open. Tying it to the
     selected state (not the modal's mount lifecycle) means the page
     content starts fading back IN as soon as the user closes the
     modal, simultaneously with the modal's exit animation, instead of
     after it. The neural canvas + drifting blobs are never hidden, so
     the background animation keeps running underneath. */
  useEffect(() => {
    if (!selected) return;
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [selected]);

  /* Scroll-scrubbed enter/exit: the section fades in as it crosses
     into the viewport and fades out as it crosses past. With min-h-screen
     plus generous vertical padding, the empty space at the top and
     bottom of each section gives scroll distance to play the transition
     in/out — no two categories share visibility at full opacity. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0, 1, 1, 0],
  );
  const sectionFilter = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(14px)'],
  );
  const sectionY = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [60, 0, 0, -60],
  );

  return (
    <motion.section
      ref={ref}
      id={`category-${category.id}`}
      style={{
        opacity: sectionOpacity,
        filter: sectionFilter,
        y: sectionY,
        willChange: 'opacity, filter, transform',
      }}
      className="scroll-mt-24 min-h-screen pt-16 pb-44 md:pt-20 md:pb-56 flex flex-col gap-10"
    >
      <motion.header
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        className="flex flex-col gap-5 max-w-3xl"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          {c.label}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-text-soft leading-relaxed"
        >
          {c.description}
        </motion.p>
      </motion.header>

      {skills.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={containerVariants}
          className="flex flex-col gap-3"
        >
          <motion.h3
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft"
          >
            {t('projects.skills')}
          </motion.h3>
          <motion.ul variants={containerVariants} className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <motion.li key={s.name} variants={itemVariants}>
                <LiquidGlass
                  as="div"
                  radius={999}
                  refractionHeight={10}
                  refractionAmount={14}
                  chromaticAberration={4}
                  blur={1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
                >
                  {s.icon && (
                    <img
                      src={s.icon}
                      alt=""
                      aria-hidden="true"
                      className="w-3.5 h-3.5 object-contain"
                    />
                  )}
                  <span>{s.name}</span>
                </LiquidGlass>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={containerVariants}
        className="flex flex-col gap-4"
      >
        <motion.h3
          variants={itemVariants}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft"
        >
          {t('projects.title')}
        </motion.h3>
        {/* Flex-wrap with explicit per-breakpoint widths. Left-aligned
            so partial rows stay flush with the left edge. Up to 4 per
            row on xl, dropping to 3 / 2 / 1 on smaller widths. */}
        <motion.div
          variants={containerVariants}
          className="flex flex-wrap justify-start gap-6"
        >
          {items.map((p) => (
            <motion.div
              key={p.id}
              variants={itemVariants}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
            >
              <ProjectGridCard project={p} onSelect={() => setSelected(p)} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectModal
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};
