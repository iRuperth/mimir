import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { config } from '@/config/env';
import { GlassCard } from '@/components/glass/GlassCard';

export const About = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const bio = config.owner.bio[lang];
  const animations = config.features.animations;

  const content = (
    <GlassCard className="p-8 md:p-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('about.title')}</h2>
      {bio.length > 0 ? (
        <p className="text-lg leading-relaxed text-text-soft whitespace-pre-line">{bio}</p>
      ) : (
        <p className="text-lg leading-relaxed text-text-soft italic">—</p>
      )}
    </GlassCard>
  );

  if (!animations) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  );
};
