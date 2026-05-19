import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface Props {
  images: string[];
  alt: string;
  autoplayMs?: number;
}

const ChevronLeft = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ImageCarousel = ({ images, alt, autoplayMs = 2000 }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  /* Autoplay — advances every `autoplayMs` while pause flag is false.
     Hovering pauses; leaving resumes. Manual nav also briefly resets
     the timer via the paused state in the click handlers below. */
  useEffect(() => {
    if (!emblaApi || paused || images.length <= 1) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), autoplayMs);
    return () => window.clearInterval(id);
  }, [emblaApi, paused, autoplayMs, images.length]);

  const bumpPause = useCallback(() => {
    setPaused(true);
    const id = window.setTimeout(() => setPaused(false), autoplayMs * 2);
    return () => window.clearTimeout(id);
  }, [autoplayMs]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    bumpPause();
  }, [emblaApi, bumpPause]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    bumpPause();
  }, [emblaApi, bumpPause]);

  const scrollTo = useCallback(
    (i: number) => {
      emblaApi?.scrollTo(i);
      bumpPause();
    },
    [emblaApi, bumpPause],
  );

  if (images.length === 0) {
    return (
      <div
        className="w-full aspect-video rounded-2xl bg-gradient-to-br from-accent/40 to-accent-2/40 flex items-center justify-center"
        role="img"
        aria-label={alt}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-soft opacity-60"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden group">
        <img
          src={images[0]}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, i) => (
            <div className="flex-[0_0_100%] min-w-0 group h-full" key={src + i}>
              <div className="h-full overflow-hidden">
                <img
                  src={src}
                  alt={`${alt} (${i + 1}/${images.length})`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LiquidGlass sets position:relative on its root, which would
         override an `absolute` on the same element. Wrap each arrow in
         an absolutely-positioned div instead so the overlay positions
         actually stick. */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <LiquidGlass
          as="button"
          type="button"
          radius={999}
          refractionHeight={14}
          refractionAmount={22}
          chromaticAberration={6}
          blur={1.5}
          onClick={scrollPrev}
          ariaLabel="Previous image"
          className="is-press p-2.5"
        >
          <ChevronLeft />
        </LiquidGlass>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
        <LiquidGlass
          as="button"
          type="button"
          radius={999}
          refractionHeight={14}
          refractionAmount={22}
          chromaticAberration={6}
          blur={1.5}
          onClick={scrollNext}
          ariaLabel="Next image"
          className="is-press p-2.5"
        >
          <ChevronRight />
        </LiquidGlass>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === selectedIndex}
            className={`h-2 rounded-full transition-all ${
              i === selectedIndex ? 'w-6 bg-accent' : 'w-2 bg-white/55 hover:bg-white/85'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
