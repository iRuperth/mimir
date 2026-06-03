import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config/env';
import { categories, projects } from '@/config/projects';
import { CategorySection } from './CategorySection';
import { ProjectCard } from '@/components/project/ProjectCard';
import type { CategoryDef, ProjectDef } from '@/config/projects';

interface CategoryGroup {
  category: CategoryDef;
  label: string;
  items: ProjectDef[];
}

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
    <div className="flex flex-col">
      {groups.map((g) => (
        <CategorySection
          key={g.category.id}
          category={g.category}
          projects={g.items}
        />
      ))}
    </div>
  );
};
