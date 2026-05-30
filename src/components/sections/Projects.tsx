import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config/env';
import { categories, projects } from '@/config/projects';
import { CategorySection } from './CategorySection';
import { ProjectCard } from '@/components/project/ProjectCard';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { scrollToElementInstant } from '@/utils/scroll';
import type { CategoryDef, ProjectDef } from '@/config/projects';

interface CategoryGroup {
  category: CategoryDef;
  label: string;
  items: ProjectDef[];
}

interface SideNavProps {
  groups: CategoryGroup[];
}

const SideNav = ({ groups }: SideNavProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [show, setShow] = useState(false);

  /* Show the side nav only while the projects area is on screen. An
     IntersectionObserver on #projects is enough for this and avoids
     useScroll's ref/position requirements (which warned because the
     target is resolved by id, not a hydrated ref). */
  useEffect(() => {
    const projects = document.getElementById('projects');
    if (!projects) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { rootMargin: '-10% 0px -10% 0px' },
    );
    obs.observe(projects);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = groups
      .map((g) => document.getElementById(`category-${g.category.id}`))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length === 0) return;
        const id = visible[0].target.id.replace(/^category-/, '');
        const idx = groups.findIndex((g) => g.category.id === id);
        if (idx >= 0) setActiveIdx(idx);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [groups]);

  if (groups.length <= 1) return null;

  return (
    <aside
      aria-label="Project categories"
      className={`hidden md:flex fixed left-6 lg:left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {groups.map((g, i) => (
        <LiquidGlass
          key={g.category.id}
          as="button"
          type="button"
          radius={999}
          refractionHeight={14}
          refractionAmount={22}
          chromaticAberration={6}
          blur={1}
          onClick={() => scrollToElementInstant(`category-${g.category.id}`, -80)}
          className={`is-press inline-flex items-center justify-start px-4 py-2 text-xs font-medium min-w-[140px] ${
            i === activeIdx
              ? 'is-active text-text'
              : 'text-text-soft hover:text-text'
          }`}
          ariaLabel={`Go to ${g.label}`}
          ariaCurrent={i === activeIdx ? 'true' : 'false'}
        >
          {g.label}
        </LiquidGlass>
      ))}
    </aside>
  );
};

export const Projects = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const animations = config.features.animations;

  const groups: CategoryGroup[] = useMemo(() => {
    const byCat = new Map<string, ProjectDef[]>();
    for (const p of projects) {
      const arr = byCat.get(p.category) ?? [];
      arr.push(p);
      byCat.set(p.category, arr);
    }
    return categories
      .filter((c) => byCat.has(c.id))
      .map((c) => ({
        category: c,
        label: lang === 'es' ? c.label_es : c.label_en,
        items: byCat.get(c.id) ?? [],
      }));
  }, [lang]);

  if (groups.length === 0) {
    return <p className="text-text-soft italic">{t('projects.empty')}</p>;
  }

  if (!animations) {
    return (
      <div className="flex flex-col gap-16">
        {groups.map((g) => (
          <div key={g.category.id} className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold">{g.label}</h2>
            <ul
              className="grid gap-6"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
            >
              {g.items.map((p) => (
                <li key={p.id}>
                  <ProjectCard project={p} compact />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        {groups.map((g) => (
          <CategorySection
            key={g.category.id}
            category={g.category}
            projects={g.items}
          />
        ))}
      </div>
      <SideNav groups={groups} />
    </>
  );
};
