import { forwardRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { LiquidGlass } from './LiquidGlass';

interface Props {
  children: ReactNode;
  strong?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  radius?: number;
}

export const GlassCard = forwardRef<HTMLElement, Props>(function GlassCard(
  { children, strong, className = '', contentClassName = '', style, radius = 24 },
  ref
) {
  return (
    <LiquidGlass
      ref={ref}
      radius={radius}
      refractionHeight={strong ? 130 : 100}
      refractionAmount={strong ? 140 : 110}
      chromaticAberration={strong ? 32 : 22}
      depthEffect={0.55}
      blur={strong ? 4 : 3}
      saturate={1.7}
      brightness={1.12}
      tone="transparent"
      className={`is-hover ${className}`}
      contentClassName={contentClassName}
      style={style}
    >
      {children}
    </LiquidGlass>
  );
});
