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
        className={`rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-2xl ${className}`}
        aria-label={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <div className={`rounded-full overflow-hidden shadow-2xl ${className}`}>
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
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
        className="relative min-h-screen flex items-start justify-center px-6 pt-28 md:pt-36"
      >
        <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
          <div className="transition-transform duration-500 ease-out hover:scale-110 motion-reduce:transform-none">
            <Avatar src={avatar} name={name} className="w-44 h-44 md:w-56 md:h-56" />
          </div>
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
      className="relative min-h-screen flex items-start justify-center px-6 pt-28 md:pt-36 overflow-hidden"
    >
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl"
      >
        {/* Avatar entrance: scale from 0.7 + blur out as it settles,
           matching the Apple-style ease used elsewhere. The outer
           motion.div handles entrance, the inner motion.div applies
           the scroll-driven scale, and the deepest div handles the
           hover scale via CSS so all three compose cleanly. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: 'blur(14px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div style={{ scale: avatarScale }}>
            <div className="transition-transform duration-500 ease-out hover:scale-110 motion-reduce:transform-none">
              <Avatar src={avatar} name={name} className="w-44 h-44 md:w-56 md:h-56" />
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-text to-text-soft bg-clip-text"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
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
