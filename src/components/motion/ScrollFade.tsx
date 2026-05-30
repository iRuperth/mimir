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

  /* layoutEffect: false defers the scroll measurement past the initial
     layout effect, so it reads the element after `relative` is applied
     rather than measuring a still-static node. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
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
      className={`relative ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
};
