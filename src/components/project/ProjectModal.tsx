import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '@/components/glass/GlassCard';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ImageCarousel } from './ImageCarousel';
import { localizedProject } from '@/config/projects';
import type { ProjectDef } from '@/config/projects';

interface Props {
  project: ProjectDef;
  onClose: () => void;
}

const ExternalIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* Expanded project view. The motion.div wrapping the card shares its
   layoutId with the originating ProjectGridCard, so framer-motion morphs
   the small card into this large one in place. */
export const ProjectModal = ({ project, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const p = localizedProject(project, lang);
  const [expanded, setExpanded] = useState(false);
  const detailParagraphs = p.details ? p.details.split(/\n\s*\n/).filter(Boolean) : [];
  const hasDetails = detailParagraphs.length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const content = (
    <>
      {/* Transparent click-catcher. The background animation (neural
         canvas + drifting blobs) stays visible; the page content gets
         hidden via the body.modal-open class set by CategorySection
         so all the user sees is the navbar, the live background and
         the expanded card. */}
      <motion.div
        key="project-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[45]"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        key="project-modal-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-28 pb-8 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
      >
        <motion.div
          layoutId={`project-card-${project.id}`}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl max-h-[96vh] overflow-hidden rounded-[28px] pointer-events-auto"
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        >
        <GlassCard radius={28} className="!overflow-hidden">
          <div className="relative overflow-y-auto max-h-[96vh] no-scrollbar">
            {expanded && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-16 z-10 w-9 h-9 rounded-full flex items-center justify-center text-text bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-colors"
                aria-label={t('projects.showLess')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-text bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-colors"
              aria-label={t('projects.close')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5 p-5 md:p-6"
            >
              <h3 className="text-xl md:text-3xl font-bold tracking-tight pr-12">
                {p.title}
              </h3>

              <div className="w-full max-w-5xl mx-auto">
                <ImageCarousel images={p.images} alt={p.title} />
              </div>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="expand"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-5 pt-1">
                      {p.tools.length > 0 && (
                        <ul className="flex flex-wrap gap-2 justify-center">
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
                      )}

                      <div className="relative rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
                        <p className="text-text-soft leading-relaxed md:text-lg">
                          {p.description}
                        </p>

                        {hasDetails && (
                          <div className="flex flex-col gap-3 pt-4 text-text-soft leading-relaxed">
                            {detailParagraphs.map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>
                        )}

                        {(p.links.length > 0 || p.isPrivate) && (
                          <ul className="flex flex-wrap items-center gap-2 mt-4">
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
                                  className="is-press px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap"
                                >
                                  {link.label}
                                  <ExternalIcon />
                                </LiquidGlass>
                              </li>
                            ))}
                            {p.isPrivate && (
                              <li>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-text-soft whitespace-nowrap">
                                  <LockIcon />
                                  {t('projects.private')}
                                </span>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end">
                <LiquidGlass
                  as="button"
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  radius={999}
                  refractionHeight={14}
                  refractionAmount={22}
                  chromaticAberration={6}
                  blur={1}
                  className="is-press px-6 py-3 text-base font-semibold"
                >
                  {expanded ? t('projects.showLess') : t('projects.showMore')}
                </LiquidGlass>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
    </>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
};
