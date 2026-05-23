import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '@/components/glass/GlassCard';
import { localizedProject } from '@/config/projects';
import type { ProjectDef } from '@/config/projects';

interface Props {
  project: ProjectDef;
  onSelect: () => void;
}

/* Small clickable preview that doubles as the source of the shared-layout
   animation. The `layoutId` matches the one on ProjectModal — when the
   modal mounts framer-motion morphs this element into the modal's larger
   container. */
export const ProjectGridCard = ({ project, onSelect }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const p = localizedProject(project, lang);

  const cover = p.images[0];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      layoutId={`project-card-${project.id}`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="text-left w-full h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[24px]"
      aria-label={`${t('projects.view')}: ${p.title}`}
    >
      <GlassCard radius={24} className="overflow-hidden h-full">
        <div className="flex flex-col h-full">
          <div className="aspect-[16/10] w-full overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/40 via-accent-2/30 to-surface/50" />
            )}
          </div>
          <div className="flex flex-col gap-2 p-5 flex-1">
            <h4 className="text-lg font-semibold tracking-tight">{p.title}</h4>
            <p className="text-sm text-text-soft leading-relaxed line-clamp-3">
              {p.description}
            </p>
            {p.tools.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {p.tools.slice(0, 4).map((tool) => (
                  <li
                    key={tool}
                    className="text-[10px] font-medium uppercase tracking-wider text-text-soft px-2 py-0.5 rounded-full border border-white/15"
                  >
                    {tool}
                  </li>
                ))}
                {p.tools.length > 4 && (
                  <li className="text-[10px] font-medium uppercase tracking-wider text-text-soft px-2 py-0.5">
                    +{p.tools.length - 4}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.button>
  );
};
