import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { getDisplacementFilter, supportsBackdropFilterUrl } from '@/utils/liquidGlass';

type Tone = 'transparent' | 'light' | 'dark';

interface Props {
  children: ReactNode;
  as?: ElementType;
  radius?: number;
  /** Legacy alias kept for backwards compat (= refractionHeight). */
  depth?: number;
  /** Legacy alias kept for backwards compat (= refractionAmount). */
  strength?: number;
  /** Thickness of the refractive bead in px (Apple shader's refractionHeight). */
  refractionHeight?: number;
  /** Max displacement at the rim in px (Apple shader's refractionAmount). */
  refractionAmount?: number;
  chromaticAberration?: number;
  depthEffect?: number;
  blur?: number;
  saturate?: number;
  brightness?: number;
  tone?: Tone;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaSelected?: boolean;
  ariaCurrent?: boolean | 'true' | 'false';
  title?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  role?: string;
}

const toneBg: Record<Tone, string> = {
  transparent: 'transparent',
  light: 'rgb(255 255 255 / 0.08)',
  dark: 'rgb(0 0 0 / 0.18)',
};

export const LiquidGlass = forwardRef<HTMLElement, Props>(function LiquidGlass(
  {
    children,
    as = 'div',
    radius = 24,
    depth,
    strength,
    refractionHeight,
    refractionAmount,
    chromaticAberration = 3,
    depthEffect = 0,
    blur = 2,
    saturate = 1.6,
    brightness = 1.08,
    tone = 'transparent',
    className = '',
    contentClassName = '',
    style,
    onClick,
    ariaLabel,
    ariaPressed,
    ariaSelected,
    ariaCurrent,
    ...rest
  },
  forwardedRef
) {
  const ariaAttrs: Record<string, unknown> = {};
  if (ariaLabel !== undefined) ariaAttrs['aria-label'] = ariaLabel;
  if (ariaPressed !== undefined) ariaAttrs['aria-pressed'] = ariaPressed;
  if (ariaSelected !== undefined) ariaAttrs['aria-selected'] = ariaSelected;
  if (ariaCurrent !== undefined) ariaAttrs['aria-current'] = ariaCurrent;

  const Tag = as as ElementType;
  const wrapperRef = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => wrapperRef.current as HTMLElement);

  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const canRefract = useMemo(() => supportsBackdropFilterUrl(), []);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rh = refractionHeight ?? depth ?? 24;
  const ra = refractionAmount ?? strength ?? 32;

  const filterStyle = useMemo<CSSProperties>(() => {
    const base = `blur(${Math.max(6, blur + 4)}px) saturate(${saturate}) brightness(${brightness})`;
    if (size.w === 0 || size.h === 0 || !canRefract) {
      return { backdropFilter: base, WebkitBackdropFilter: base };
    }
    const url = getDisplacementFilter({
      width: size.w,
      height: size.h,
      radius,
      refractionHeight: rh,
      refractionAmount: ra,
      chromaticAberration,
      depthEffect,
    });
    const chain = `blur(${blur / 2}px) url('${url}') blur(${blur}px) brightness(${brightness}) saturate(${saturate})`;
    return { backdropFilter: chain, WebkitBackdropFilter: chain };
  }, [size.w, size.h, radius, rh, ra, chromaticAberration, depthEffect, blur, saturate, brightness, canRefract]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.setProperty('--lg-radius', `${radius}px`);
  }, [radius]);

  return (
    <Tag
      ref={wrapperRef as React.Ref<HTMLElement>}
      onClick={onClick}
      className={`liquid-glass relative isolate overflow-hidden ${className}`}
      style={{ borderRadius: radius, ...style }}
      {...ariaAttrs}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: toneBg[tone], borderRadius: 'inherit' }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ borderRadius: 'inherit', ...filterStyle }}
      />
      <span
        aria-hidden="true"
        className="lg-highlight absolute inset-0 z-[3] pointer-events-none"
        style={{ borderRadius: 'inherit' }}
      />
      <span className={`relative z-[4] block w-full h-full ${contentClassName}`}>
        {children}
      </span>
    </Tag>
  );
});
