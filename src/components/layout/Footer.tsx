import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { config } from '@/config/env';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { SocialLinks } from './SocialLinks';
import { scrollToElementInstant } from '@/utils/scroll';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const NAV_OFFSET = -80;

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const animations = config.features.animations;
  const tagline = config.footer.tagline;
  const guestbookEnabled = config.guestbook.enabled;

  const middle = (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {guestbookEnabled && (
        <button
          type="button"
          onClick={() => scrollToElementInstant('guestbook', NAV_OFFSET)}
          className="text-sm font-medium text-text hover:text-accent transition-colors"
        >
          {t('footer.leave_note')}
        </button>
      )}
      {tagline && (
        <p className="text-xs uppercase tracking-[0.18em] text-text-soft">
          {tagline}
        </p>
      )}
    </div>
  );

  const inner = (
    <LiquidGlass
      radius={20}
      refractionHeight={32}
      refractionAmount={40}
      chromaticAberration={10}
      depthEffect={0.3}
      blur={2}
      className="mx-auto w-full max-w-[1480px] px-6 md:px-10 py-6"
      contentClassName="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-center"
    >
      {animations ? (
        <motion.p
          variants={itemVariants}
          className="text-sm text-text-soft text-center md:text-left"
        >
          {`\u00A9 ${year} ${config.owner.name}. ${t('footer.rights')}`}
        </motion.p>
      ) : (
        <p className="text-sm text-text-soft text-center md:text-left">
          {`\u00A9 ${year} ${config.owner.name}. ${t('footer.rights')}`}
        </p>
      )}

      {animations ? (
        <motion.div variants={itemVariants}>{middle}</motion.div>
      ) : (
        middle
      )}

      {animations ? (
        <motion.div variants={itemVariants} className="flex justify-center md:justify-end">
          <SocialLinks />
        </motion.div>
      ) : (
        <div className="flex justify-center md:justify-end">
          <SocialLinks />
        </div>
      )}
    </LiquidGlass>
  );

  if (!animations) {
    return <footer className="mt-24 px-6 pb-6">{inner}</footer>;
  }

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={containerVariants}
      className="mt-24 px-6 pb-6"
    >
      {inner}
    </motion.footer>
  );
};
