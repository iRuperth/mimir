import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface Props {
  images: string[];
  alt: string;
  autoplayMs?: number;
  /* "cover" (default) crops images to fill a 16:9 frame, used on the
     compact card. "contain" shows the whole image without cropping on a
     neutral backdrop, used in the modal where detail matters. "portrait"
     is "contain" inside a tall phone-shaped frame, for mobile-app
     screenshots that would otherwise float in an ultrawide letterbox. */
  fit?: 'cover' | 'contain' | 'portrait';
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

export const ImageCarousel = ({ images, alt, autoplayMs = 2000, fit = 'cover' }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  /* Project screenshots are ~2.2:1 ultrawide. "cover" crops them into a
     16:9 thumbnail on the card; "contain" keeps the full frame in the
     modal, with the frame matching the screenshots' real ratio so they
     fill it edge-to-edge instead of sitting in side letterbox bars.
     "portrait" is for tall phone screenshots (~9:19.5): a phone-shaped
     frame holding the whole image so it reads as a real device capture
     instead of a sliver lost in an ultrawide letterbox. */
  const isPortrait = fit === 'portrait';
  const isContain = fit === 'contain' || isPortrait;
  /* Portrait: cap the frame's HEIGHT to a slice of the viewport and let the
     9:19.5 aspect-ratio derive the width from it, so the phone never grows
     tall enough to push the modal's controls off-screen. h-[…] + aspect +
     mx-auto = a centered, height-bounded phone. Landscape/contain frames are
     width-driven as before. */
  /* Portrait: a phone-shaped frame. Matches the screenshots' real ~9:18.8
     ratio and is height-capped so it never pushes the modal controls
     off-screen. The image inside is object-contain, so it's shown WHOLE
     vertically (nothing cropped top/bottom); the device look comes from the
     frame's bezel + rounded corners, not from cropping the screenshot. */
  const frameAspect = isPortrait
    ? 'h-[68vh] max-h-[560px] aspect-[9/18.8] w-auto mx-auto'
    : isContain
      ? 'aspect-[64/29]'
      : 'aspect-video';
  const imgFit = isContain ? 'object-contain' : 'object-cover';
  const hoverScale = isContain ? '' : 'group-hover:scale-105';
  const frameRound = isPortrait ? 'rounded-[2rem]' : 'rounded-2xl';
  /* Portrait phone bezel: a dark, rounded carcass drawn AROUND the image so
     the corners read as a real device without cropping the screenshot
     vertically. */
  const phoneBezel = isPortrait
    ? 'bg-neutral-950 ring-1 ring-white/10 shadow-2xl p-1.5'
    : '';
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

  /* Autoplay advances every `autoplayMs` while pause flag is false.
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
      <div
        className={`w-full ${frameAspect} ${frameRound} ${phoneBezel} overflow-hidden group ${
          isContain && !isPortrait ? 'bg-black/20' : ''
        }`}
      >
        <div className={`w-full h-full overflow-hidden ${isPortrait ? 'rounded-[1.6rem]' : ''}`}>
          <img
            src={images[0]}
            alt={alt}
            loading="lazy"
            className={`w-full h-full ${imgFit} transition-transform duration-500 ease-out ${
              isContain ? '' : 'group-hover:scale-110'
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${frameAspect}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`absolute inset-0 overflow-hidden ${frameRound} ${phoneBezel} ${
          isContain && !isPortrait ? 'bg-black/20' : ''
        }`}
        ref={emblaRef}
      >
        <div className="flex h-full">
          {images.map((src, i) => (
            <div className="flex-[0_0_100%] min-w-0 group h-full" key={src + i}>
              {/* The slide's own wrapper carries the rounding. Embla translates
                  each slide with a transform, which spawns a compositing layer
                  that ignores the rounded ancestor's overflow clip (same iOS
                  Safari issue noted elsewhere), so the corners looked square.
                  Rounding the slide wrapper itself clips locally and survives
                  the transform. The image is object-contain so the screenshot
                  is whole top-to-bottom; the bezel padding gives it a device
                  border. */}
              {/* Carousel slides are all in the DOM but translated off screen,
                  so `loading="lazy"` left every off-screen slide unloaded (it
                  never enters the viewport), so they showed up blank as the
                  carousel advanced. Eager-load them so they're ready by the time
                  autoplay reaches each one; decode async to avoid jank. */}
              <div className={`h-full overflow-hidden ${isPortrait ? 'rounded-[1.6rem]' : frameRound}`}>
                <img
                  src={src}
                  alt={`${alt} (${i + 1}/${images.length})`}
                  loading="eager"
                  decoding="async"
                  className={`w-full h-full ${imgFit} transition-transform duration-500 ease-out ${hoverScale}`}
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
