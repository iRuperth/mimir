import { forwardRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { LiquidGlass } from './LiquidGlass';
import { useGlassParams } from '@/hooks/useGlassTuning';

interface Props {
  children: ReactNode;
  strong?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  radius?: number;
}

export const GlassCard = forwardRef<HTMLElement, Props>(function GlassCard(
  { children, strong, className = '', contentClassName = '', style, radius },
  ref
) {
  const p = useGlassParams();
  const k = strong ? 1.3 : 1;

  return (
    <LiquidGlass
      ref={ref}
      radius={radius ?? p.radius}
      refractionHeight={p.refractionHeight * k}
      refractionAmount={p.refractionAmount * k}
      chromaticAberration={p.chromaticAberration * k}
      depthEffect={strong ? 0.35 : 0.2}
      blur={strong ? p.blur + 1 : p.blur}
      saturate={p.saturate}
      brightness={p.brightness}
      tone="transparent"
      className={`is-hover ${className}`}
      contentClassName={contentClassName}
      style={style}
    >
      {children}
    </LiquidGlass>
  );
});
