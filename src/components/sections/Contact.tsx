import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { config } from '@/config/env';
import { GlassCard } from '@/components/glass/GlassCard';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { SocialLinks } from '@/components/layout/SocialLinks';

export const Contact = () => {
  const { t } = useTranslation();
  const email = config.socials.email;
  const animations = config.features.animations;

  const content = (
    <GlassCard className="p-8 md:p-12 text-center flex flex-col items-center gap-6">
      <div className="flex flex-col gap-3 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold">{t('contact.title')}</h2>
        <p className="text-lg text-text-soft">{t('contact.subtitle')}</p>
      </div>

      {email.length > 0 && (
        <LiquidGlass
          as="a"
          href={`mailto:${email}`}
          radius={999}
          refractionHeight={16}
          refractionAmount={24}
          chromaticAberration={7}
          blur={1.5}
          className="is-press px-6 py-3 text-base font-semibold inline-flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          {email}
        </LiquidGlass>
      )}

      <SocialLinks />
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
