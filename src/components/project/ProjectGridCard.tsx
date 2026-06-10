import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '@/components/glass/GlassCard';
import { localizedProject } from '@/config/projects';
import type { ProjectDef } from '@/config/projects';

interface Props {
  project: ProjectDef;
  onSelect: () => void;
  /* Carousel renders three copies of each project for seamless wrap;
     only one may own the shared layoutId or the modal close animation
     can't decide which card to morph back into. */
  shareLayout?: boolean;
}

/* Small clickable preview that doubles as the source of the shared-layout
   animation. The `layoutId` matches the one on ProjectModal: when the
   modal mounts framer-motion morphs this element into the modal's larger
   container. */
export const ProjectGridCard = ({ project, onSelect, shareLayout = true }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const p = localizedProject(project, lang);

  const cover = p.images[0];
  const portrait = p.isPortrait;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      layoutId={shareLayout ? `project-card-${project.id}` : undefined}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="text-left w-full h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[24px]"
      aria-label={`${t('projects.view')}: ${p.title}`}
    >
      <GlassCard radius={24} className="project-card overflow-hidden h-full">
        <div className="flex flex-col h-full">
          {/* The cover clips its own top corners (rounded-t-[24px]) instead
              of relying on the GlassCard ancestor's overflow:hidden. On iOS
              Safari that ancestor clip fails because .liquid-glass runs a
              backdrop-filter, which spawns a compositing layer that ignores
              the rounded overflow, so the square image corners spilled past
              the card border on mobile. Rounding the image's own wrapper
              (and the media itself) keeps the clip local and bug-proof. */}
          {/* Portrait (mobile-app) covers: the tall screenshot sits as a phone
              inside a 16:10 area on a soft backdrop. The image is object-contain
              (whole top-to-bottom, never cropped vertically); a dark rounded
              bezel around it gives the real-device look. Landscape covers are
              unchanged. */}
          {portrait ? (
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-[24px] bg-gradient-to-br from-accent/15 via-surface/30 to-accent-2/15 flex items-end justify-center pt-4">
              {cover ? (
                <div className="h-full aspect-[9/18.8] overflow-hidden rounded-[20px] bg-neutral-950 ring-1 ring-white/10 shadow-xl p-1">
                  <img
                    src={cover}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-contain rounded-[16px] transition-transform duration-700 ease-out"
                  />
                </div>
              ) : (
                <div className="h-full aspect-[9/18.8] rounded-[20px] bg-gradient-to-br from-accent/40 via-accent-2/30 to-surface/50" />
              )}
            </div>
          ) : (
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-[24px]">
              {cover ? (
                <img
                  src={cover}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover rounded-t-[24px] transition-transform duration-700 ease-out hover:scale-105"
                />
              ) : (
                <div className="w-full h-full rounded-t-[24px] bg-gradient-to-br from-accent/40 via-accent-2/30 to-surface/50" />
              )}
            </div>
          )}
          <div className="flex flex-col gap-2 p-5 flex-1">
            <h4 className="text-lg font-semibold tracking-tight">{p.title}</h4>
            <p className="text-sm text-text-soft leading-relaxed line-clamp-3 text-justify md:text-left">
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
