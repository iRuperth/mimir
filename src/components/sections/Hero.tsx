import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { config } from '@/config/env';

const ScrollChevron = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Avatar = ({ src, name, className = '' }: { src: string; name: string; className?: string }) => {
  const [failed, setFailed] = useState(false);
  const showFallback = src.length === 0 || failed;

  if (showFallback) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-2xl transition-transform duration-500 ease-out hover:scale-110 ${className}`}
        aria-label={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <div className={`rounded-full overflow-hidden shadow-2xl group ${className}`}>
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
    </div>
  );
};

export const Hero = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const animations = config.features.animations;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, 60]);
  const avatarScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);

  const { name, title, avatar } = config.owner;

  if (!animations) {
    return (
      <section
        ref={ref}
        id="home"
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
          <Avatar src={avatar} name={name} className="w-32 h-32 md:w-40 md:h-40" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{name}</h1>
          <p className="text-xl md:text-2xl text-text-soft">{title}</p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-soft text-xs uppercase tracking-widest">
          <span>{t('hero.scroll')}</span>
          <ScrollChevron />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl"
      >
        <motion.div style={{ scale: avatarScale }}>
          <Avatar src={avatar} name={name} className="w-32 h-32 md:w-40 md:h-40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-text to-text-soft bg-clip-text"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="text-xl md:text-2xl text-text-soft"
        >
          {title}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-soft text-xs uppercase tracking-widest"
      >
        <span>{t('hero.scroll')}</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ScrollChevron />
        </motion.span>
      </motion.div>
    </section>
  );
};
