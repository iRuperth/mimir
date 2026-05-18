import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { config } from '@/config/env';
import { categories, projects } from '@/config/projects';
import { Categories } from './Categories';
import { ProjectCard } from '@/components/project/ProjectCard';
import type { ProjectDef } from '@/config/projects';

type CategoryId = string | 'all';

interface CategoryGroup {
  id: string;
  label: string;
  items: ProjectDef[];
}

interface EmergingProps {
  project: ProjectDef;
  index: number;
  total: number;
  phase: MotionValue<number>;
}

const EmergingProject = ({ project, index, total, phase }: EmergingProps) => {
  const delay = 0.1 + (index / Math.max(1, total)) * 0.18;
  const opacity = useTransform(phase, [delay, delay + 0.12, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(phase, [delay, delay + 0.2], [60, 0]);

  return (
    <motion.div style={{ opacity, y }}>
      <ProjectCard project={project} compact />
    </motion.div>
  );
};

interface SceneProps {
  group: CategoryGroup;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const CategoryScene = ({ group, index, total, progress }: SceneProps) => {
  const start = index / total;
  const end = (index + 1) / total;
  const phase = useTransform(progress, [start, end], [0, 1]);
  const sceneOpacity = useTransform(
    progress,
    [start, start + 0.04, end - 0.04, end],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      style={{ opacity: sceneOpacity }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div
        className="grid w-full max-w-6xl mx-auto gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(760px, 1100px))', justifyContent: 'center' }}
      >
        {group.items.map((p, i) => (
          <EmergingProject
            key={p.id}
            project={p}
            index={i}
            total={group.items.length}
            phase={phase}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface CategoryScenesProps {
  groups: CategoryGroup[];
}

const CategoryScenes = ({ groups }: CategoryScenesProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `${groups.length * 180}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {groups.map((g, i) => (
          <CategoryScene
            key={g.id}
            group={g}
            index={i}
            total={groups.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};

export const Projects = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const [active, setActive] = useState<CategoryId>('all');
  const animations = config.features.animations;

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<CategoryId>;
      if (ce.detail) setActive(ce.detail);
    };
    window.addEventListener('mimir:filter', handler);
    return () => window.removeEventListener('mimir:filter', handler);
  }, []);

  const filtered = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  const groups: CategoryGroup[] = useMemo(() => {
    const byCat = new Map<string, ProjectDef[]>();
    for (const p of filtered) {
      const arr = byCat.get(p.category) ?? [];
      arr.push(p);
      byCat.set(p.category, arr);
    }
    return categories
      .filter((c) => byCat.has(c.id))
      .map((c) => ({
        id: c.id,
        label: lang === 'es' ? c.label_es : c.label_en,
        items: byCat.get(c.id) ?? [],
      }));
  }, [filtered, lang]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl md:text-5xl font-bold">{t('projects.title')}</h2>
        <Categories active={active} onChange={setActive} />
      </div>

      {groups.length === 0 && (
        <p className="text-text-soft italic">{t('projects.empty')}</p>
      )}

      {groups.length > 0 && animations && <CategoryScenes groups={groups} />}

      {groups.length > 0 && !animations && (
        <div className="flex flex-col gap-12">
          {groups.map((g) => (
            <div key={g.id} className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold">{g.label}</h3>
              <ul className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {g.items.map((p) => (
                  <li key={p.id}>
                    <ProjectCard project={p} compact />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
