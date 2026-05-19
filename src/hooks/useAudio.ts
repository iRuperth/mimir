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
    a.preload = 'none';
    audioRef.current = a;
    return () => {
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
