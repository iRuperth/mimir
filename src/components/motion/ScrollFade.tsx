import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { config } from '@/config/env';

interface Props {
  children: ReactNode;
  className?: string;
}

export const ScrollFade = ({ children, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const animations = config.features.animations;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const filter = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(14px)'],
  );
  const y = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [60, 0, 0, -60]);

  if (!animations) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter, y, willChange: 'opacity, filter, transform' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
