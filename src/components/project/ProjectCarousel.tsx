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
  /* Last scrollLeft the rAF loop wrote, rounded. Lets onScroll tell apart
     our own programmatic scroll from a native trackpad/wheel scroll. */
  const lastWrittenRef = useRef(-1);
  /* cardStep getter shared between the rAF loop and the arrow handlers. */
  const stepRef = useRef<() => number>(() => 0);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = scrollerRef.current;
    if (!el) return;

    const n = items.length;
    /* Exact width of one copy: the distance between the start of the middle
       copy (child index n) and the start of the last copy (child index 2n).
       Using offsetLeft includes the inter-card gaps precisely, so wrapping
       by this amount lands seamlessly with no leftover gap. scrollWidth/3
       would be wrong because the gap between copies isn't evenly divisible. */
    const copyWidth = () => {
      const children = el.children;
      const mid = children[n] as HTMLElement | undefined;
      const last = children[2 * n] as HTMLElement | undefined;
      if (!mid || !last) return 0;
      return last.offsetLeft - mid.offsetLeft;
    };
    const cardStep = () => {
      const card = el.firstElementChild as HTMLElement | null;
      return (card ? card.offsetWidth : el.clientWidth / 4) + GAP;
    };

    /* Keep target inside the middle copy [start, start + w). The live
       scrollLeft is shifted by the same whole-copy amount so the eased
       follow never has to cross a wrap boundary. target is the source of
       truth; scrollLeft tracks it. start is the offsetLeft of the middle
       copy's first card, w its exact width (gaps included). */
    const wrap = () => {
      const w = copyWidth();
      if (w === 0) return;
      const mid = el.children[n] as HTMLElement | undefined;
      const start = mid ? mid.offsetLeft : w;
      let shifted = 0;
      while (targetRef.current < start) {
        targetRef.current += w;
        shifted += w;
      }
      while (targetRef.current >= start + w) {
        targetRef.current -= w;
        shifted -= w;
      }
      if (shifted !== 0) el.scrollLeft += shifted;
    };

    /* Anchor the scroller at the first card of the middle copy. Until a
       real card has a real width (parent filters, fonts, images, etc. can
       all delay layout) we keep retrying — otherwise scrollLeft snaps to
       a half-measured position and one lone card ends up parked at the
       right edge with nothing else on screen. */
    const anchor = () => {
      const card = el.firstElementChild as HTMLElement | null;
      const w = copyWidth();
      if (!card || card.offsetWidth === 0 || w === 0) return false;
      const mid = el.children[n] as HTMLElement | undefined;
      const start = mid ? mid.offsetLeft : w;
      targetRef.current = start;
      el.scrollLeft = start;
      readyRef.current = true;
      return true;
    };

    const tick = () => {
      if (!readyRef.current) anchor();
      if (readyRef.current) {
        if (!pausedRef.current && !draggingRef.current && !reducedMotion.current) {
          targetRef.current += AUTO_SPEED;
        }
        // Wrap first so target stays in range, then ease toward it.
        wrap();
        if (!draggingRef.current) {
          const next = el.scrollLeft + (targetRef.current - el.scrollLeft) * EASE;
          el.scrollLeft = next;
          lastWrittenRef.current = Math.round(el.scrollLeft);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    /* Re-anchor whenever the first card's box changes size: viewport resize,
       sidebar appears, parent un-blurs, fonts settle, etc. */
    const ro = new ResizeObserver(() => {
      if (draggingRef.current) return;
      readyRef.current = false;
    });
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (firstCard) ro.observe(firstCard);
    ro.observe(el);

    /* Re-anchor when the carousel re-enters the viewport. The parent's
       scroll-driven blur/opacity can leave scrollLeft in a weird state
       after the section scrolls off and back; treating each re-entry as
       a fresh mount guarantees the first visible frame is centered. */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !draggingRef.current) {
          readyRef.current = false;
        }
      },
      { threshold: 0 },
    );
    io.observe(el);

    // Expose helpers for the arrow handlers via the element dataset-free refs.
    stepRef.current = cardStep;

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
    };
  }, [items.length]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    draggingRef.current = true;
    movedRef.current = false;
    dragStartX.current = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    // NOTE: do NOT capture the pointer here. Capturing on press would
    // redirect the resulting click to this container, so a plain click on
    // a card would never reach it and the modal wouldn't open. We only
    // capture once an actual drag starts (see onPointerMove).
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 4 && !movedRef.current) {
      movedRef.current = true;
      // A real drag has begun — capture the pointer now so the scrub
      // tracks smoothly even if the cursor leaves the element.
      el.setPointerCapture(e.pointerId);
    }
    if (!movedRef.current) return;
    el.scrollLeft = dragStartScroll.current - dx;
    targetRef.current = el.scrollLeft;
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (scrollerRef.current?.hasPointerCapture(e.pointerId)) {
      scrollerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      movedRef.current = false;
    }
  };

  /* Native scroll (trackpad / shift+wheel) moves scrollLeft directly. If
     the new value isn't the one the rAF loop just wrote, the user scrolled
     manually, so snap the target to it instead of letting the easing fight
     back. */
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || draggingRef.current) return;
    if (Math.round(el.scrollLeft) !== lastWrittenRef.current) {
      targetRef.current = el.scrollLeft;
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
        onScroll={onScroll}
        onClickCapture={onClickCapture}
        className="flex gap-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
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
