import { useTranslation } from 'react-i18next';
import { GlassCard } from '@/components/glass/GlassCard';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ImageCarousel } from './ImageCarousel';
import { localizedProject } from '@/config/projects';
import type { ProjectDef } from '@/config/projects';

interface Props {
  project: ProjectDef;
  compact?: boolean;
}

export const ProjectCard = ({ project, compact }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const p = localizedProject(project, lang);

  return (
    <GlassCard className="overflow-hidden">
      <div className={`gap-6 ${compact ? 'grid grid-cols-[2fr_3fr] items-center p-8 min-h-[480px]' : 'grid gap-6 md:grid-cols-2 p-4 md:p-6'}`}>
        <div className="w-full">
          <ImageCarousel images={p.images} alt={p.title} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl md:text-3xl font-bold">{p.title}</h3>
          <p className="text-text-soft leading-relaxed">{p.description}</p>

          {p.tools.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-soft">
                {t('projects.tools')}
              </span>
              <ul className="flex flex-wrap gap-2">
                {p.tools.map((tool) => (
                  <LiquidGlass
                    key={tool}
                    as="li"
                    radius={999}
                    refractionHeight={10}
                    refractionAmount={14}
                    chromaticAberration={4}
                    blur={1}
                    className="px-3 py-1 text-xs font-medium"
                  >
                    {tool}
                  </LiquidGlass>
                ))}
              </ul>
            </div>
          )}

          {(p.links.length > 0 || p.isPrivate) && (
            <ul className="flex flex-wrap items-center gap-2 mt-2">
              {p.links.map((link) => (
                <li key={link.url + link.label}>
                  <LiquidGlass
                    as="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    radius={999}
                    refractionHeight={14}
                    refractionAmount={22}
                    chromaticAberration={6}
                    blur={1}
                    className="is-press px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5"
                  >
                    {link.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </LiquidGlass>
                </li>
              ))}
              {p.isPrivate && (
                <li>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-text-soft">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {t('projects.private')}
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
