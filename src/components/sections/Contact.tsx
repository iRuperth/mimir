import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { config } from '@/config/env';
import { GlassCard } from '@/components/glass/GlassCard';
import { SocialLinks } from '@/components/layout/SocialLinks';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export const Contact = () => {
  const { t } = useTranslation();
  const animations = config.features.animations;
  const ref = useRef<HTMLDivElement>(null);

  /* Scroll-scrubbed wrapper so the section eases in as it approaches
     the viewport. Apple-style: blur + lift + opacity, settled by the
     time the user reads it. No fade-out — it's the last meaningful
     section before the footer, so it stays visible once revealed. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  const wrapperOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const wrapperY = useTransform(scrollYProgress, [0, 0.6], [60, 0]);
  const wrapperFilter = useTransform(
    scrollYProgress,
    [0, 0.6],
    ['blur(12px)', 'blur(0px)'],
  );

  const content = (
    <GlassCard className="p-8 md:p-12 text-center flex flex-col items-center gap-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        className="flex flex-col items-center gap-6 w-full"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold">{t('contact.title')}</h2>
          <p className="text-lg text-text-soft">{t('contact.subtitle')}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SocialLinks />
        </motion.div>
      </motion.div>
    </GlassCard>
  );

  if (!animations) return content;

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: wrapperOpacity,
        y: wrapperY,
        filter: wrapperFilter,
        willChange: 'opacity, transform, filter',
      }}
    >
      {content}
    </motion.div>
  );
};
