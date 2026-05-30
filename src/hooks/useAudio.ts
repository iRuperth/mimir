import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '@/config/env';

/* Storage key is versioned. Bumping it discards any prior saved
   volumes so the default from VITE_MUSIC_VOLUME (.env) takes effect
   again — useful when the default itself changes. */
const STORAGE_KEY = 'mimir-music-volume-v2';

const readStoredVolume = (): number | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const v = Number(raw);
    if (!Number.isFinite(v)) return null;
    return Math.min(1, Math.max(0, v));
  } catch {
    return null;
  }
};

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /* Once the user takes manual control (presses the music button), the
     autoplay fallback must stop trying to start playback on later
     gestures — otherwise pausing and then clicking elsewhere would
     restart the music. This ref carries that "hands off" signal into the
     autoplay effect. */
  const userControlledRef = useRef(false);
  /* Lets toggle() tear down any pending autoplay gesture listeners the
     moment the user presses the button. */
  const autoplayCleanupRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(
    () => readStoredVolume() ?? config.audio.volume,
  );
  const available = config.features.music && config.audio.file.length > 0;

  useEffect(() => {
    if (!available) return;
    const a = new Audio(config.audio.file);
    a.loop = true;
    a.volume = volume;
    a.preload = 'auto';
    audioRef.current = a;

    /* Autostart when the visitor scrolls into the "About me" section.
       By then they've interacted with the page (scrolled, clicked), so
       the browser allows audio to play. Triggering on a meaningful spot
       beats fighting the first-gesture race and never fires for someone
       who only glances at the hero. Volume is left untouched so a
       returning visitor who muted to 0 stays muted. */
    let cleanedUp = false;
    const markPlaying = () => {
      if (!cleanedUp) setPlaying(true);
    };

    let observer: IntersectionObserver | null = null;
    const stopObserving = () => {
      observer?.disconnect();
      observer = null;
    };

    const tryStart = () => {
      // The user's manual choice (e.g. an explicit pause) always wins.
      if (userControlledRef.current) return;
      a.play().then(markPlaying).catch(() => {});
    };

    const armAboutTrigger = () => {
      const about = document.getElementById('about');
      if (!about) return;
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            stopObserving();
            tryStart();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(about);
    };

    /* #about may not be in the DOM the instant this effect runs; defer to
       the next frame so the section tree has mounted. */
    const armFrame = requestAnimationFrame(armAboutTrigger);

    autoplayCleanupRef.current = stopObserving;

    return () => {
      cleanedUp = true;
      cancelAnimationFrame(armFrame);
      stopObserving();
      a.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available]);

  /* Apply volume changes live so dragging the slider while playing
     updates output immediately, and persist so the user's preference
     survives reloads. Volume change must NOT recreate the audio
     element — that would reset playback position. */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    try {
      localStorage.setItem(STORAGE_KEY, String(volume));
    } catch {
      /* quota / disabled — fine */
    }
  }, [volume]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    // The user is now driving playback — disable the autoplay fallback so
    // it can never override an explicit pause.
    userControlledRef.current = true;
    autoplayCleanupRef.current?.();
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.min(1, Math.max(0, v)));
  }, []);

  return { playing, toggle, available, volume, setVolume };
};
