import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
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

/* Word-by-word entrance: each word fades up from the left so the line
   reads in left-to-right, matching the Apple-style ease used elsewhere. */
const wordContainer = (delayChildren: number, staggerChildren = 0.09): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

const wordChild: Variants = {
  hidden: { opacity: 0, x: -22, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
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
        className="relative min-h-screen flex items-center justify-center px-6 pt-24 md:pt-28 pb-[30vh]"
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
      className="relative min-h-screen flex items-center justify-center px-6 pt-24 md:pt-28 pb-[30vh] overflow-hidden"
    >
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl"
      >
        {/* Avatar entrance: a plain soft fade-in — no movement, no
           scale — matching the Apple-style ease used elsewhere. The
           outer motion.div handles entrance, the inner motion.div
           applies the scroll-driven scale, and the deepest div handles
           the hover scale via CSS so all three compose cleanly. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div style={{ scale: avatarScale }}>
            <div className="transition-transform duration-500 ease-out hover:scale-110 motion-reduce:transform-none">
              <Avatar src={avatar} name={name} className="w-44 h-44 md:w-56 md:h-56" />
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={wordContainer(0.3)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-[0.28em] text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-text to-text-soft bg-clip-text"
        >
          {name.split(' ').map((word, i) => (
            <motion.span key={`${word}-${i}`} variants={wordChild} className="inline-block">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={wordContainer(0.6, 0.08)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-[0.3em] text-xl md:text-2xl text-text-soft"
        >
          {title.split(' ').map((word, i) => (
            <motion.span key={`${word}-${i}`} variants={wordChild} className="inline-block">
              {word}
            </motion.span>
          ))}
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
