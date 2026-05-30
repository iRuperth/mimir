import { useEffect, useRef } from 'react';
import { ProjectGridCard } from './ProjectGridCard';
import type { ProjectDef } from '@/config/projects';

interface Props {
  items: ProjectDef[];
  onSelect: (p: ProjectDef) => void;
}

/* Infinite, auto-scrolling, draggable project carousel used when a category
   has more than four projects. A single rAF loop eases the real scroll
   position toward a target each frame: the auto-scroll nudges the target
   forward continuously, the arrows add exactly one card to it (so a press
   always lands a whole card, never half-cut, and repeated presses keep
   advancing without stalling), and dragging sets position directly. The
   list is rendered three times and both the scroll and the target are
   wrapped within the middle copy, so motion is seamless in both directions
   with no jump. */
const AUTO_SPEED = 0.4; // px per frame
const EASE = 0.12; // how fast the scroll catches up to the target

const GAP = 24; // matches the gap-6 between cards

export const ProjectCarousel = ({ items, onSelect }: Props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const reducedMotion = useRef(false);
  const readyRef = useRef(false);

  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const movedRef = useRef(false);
  /* cardStep getter shared between the rAF loop and the arrow handlers. */
  const stepRef = useRef<() => number>(() => 0);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = scrollerRef.current;
    if (!el) return;

    const copyWidth = () => el.scrollWidth / 3;
    const cardStep = () => {
      const card = el.firstElementChild as HTMLElement | null;
      return (card ? card.offsetWidth : el.clientWidth / 4) + GAP;
    };

    /* Wrap both the live scroll and the target by one copy width so the
       carousel never reaches an edge. Applied to scrollLeft AND target
       together so easing never fights the wrap. */
    const wrap = () => {
      const w = copyWidth();
      if (w === 0) return;
      if (el.scrollLeft < w * 0.5) {
        el.scrollLeft += w;
        targetRef.current += w;
      } else if (el.scrollLeft > w * 1.5) {
        el.scrollLeft -= w;
        targetRef.current -= w;
      }
    };

    const tick = () => {
      const w = copyWidth();
      if (!readyRef.current && w > 0) {
        el.scrollLeft = w;
        targetRef.current = w;
        readyRef.current = true;
      }
      if (readyRef.current) {
        if (!pausedRef.current && !draggingRef.current && !reducedMotion.current) {
          targetRef.current += AUTO_SPEED;
        }
        if (!draggingRef.current) {
          // Ease the real position toward the target.
          el.scrollLeft += (targetRef.current - el.scrollLeft) * EASE;
        }
        wrap();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Expose helpers for the arrow handlers via the element dataset-free refs.
    stepRef.current = cardStep;

    return () => cancelAnimationFrame(rafRef.current);
  }, [items.length]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    draggingRef.current = true;
    movedRef.current = false;
    dragStartX.current = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 4) movedRef.current = true;
    el.scrollLeft = dragStartScroll.current - dx;
    targetRef.current = el.scrollLeft;
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    scrollerRef.current?.releasePointerCapture(e.pointerId);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      movedRef.current = false;
    }
  };

  /* Arrows move the target by exactly one card from the current target
     (not the live position), so rapid presses queue up and keep advancing
     smoothly instead of waiting for a scroll animation to finish. */
  const nudge = (dir: 1 | -1) => {
    const step = stepRef.current();
    if (step === 0) return;
    const snapped = Math.round(targetRef.current / step) * step;
    targetRef.current = snapped + dir * step;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="flex gap-6 overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)',
        }}
      >
        {[0, 1, 2].map((copy) =>
          items.map((p) => (
            <div
              key={`${copy}-${p.id}`}
              className="shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              aria-hidden={copy !== 1}
            >
              <ProjectGridCard project={p} onSelect={() => onSelect(p)} />
            </div>
          )),
        )}
      </div>

      <button
        type="button"
        aria-label="Previous projects"
        onClick={() => nudge(-1)}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-text transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next projects"
        onClick={() => nudge(1)}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-text transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};
