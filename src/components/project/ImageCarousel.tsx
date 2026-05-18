import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface Props {
  images: string[];
  alt: string;
}

export const ImageCarousel = ({ images, alt }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  if (images.length === 0) {
    return (
      <div
        className="w-full aspect-video rounded-2xl bg-gradient-to-br from-accent/40 to-accent-2/40 flex items-center justify-center"
        role="img"
        aria-label={alt}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-soft opacity-60" aria-hidden="true">
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
    <div className="relative w-full">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div className="flex-[0_0_100%] min-w-0 group" key={src + i}>
              <div className="aspect-video overflow-hidden">
                <img
                  src={src}
                  alt={`${alt} (${i + 1}/${images.length})`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <LiquidGlass
        as="button"
        type="button"
        radius={999}
        refractionHeight={12}
        refractionAmount={18}
        chromaticAberration={5}
        blur={1}
        onClick={scrollPrev}
        ariaLabel="Previous image"
        className="is-press absolute left-3 top-1/2 -translate-y-1/2 p-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </LiquidGlass>

      <LiquidGlass
        as="button"
        type="button"
        radius={999}
        refractionHeight={12}
        refractionAmount={18}
        chromaticAberration={5}
        blur={1}
        onClick={scrollNext}
        ariaLabel="Next image"
        className="is-press absolute right-3 top-1/2 -translate-y-1/2 p-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </LiquidGlass>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === selectedIndex}
            className={`h-2 rounded-full transition-all ${
              i === selectedIndex ? 'w-6 bg-accent' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
