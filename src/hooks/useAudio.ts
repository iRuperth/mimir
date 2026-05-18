import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '@/config/env';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const available = config.features.music && config.audio.file.length > 0;

  useEffect(() => {
    if (!available) return;
    const a = new Audio(config.audio.file);
    a.loop = true;
    a.volume = config.audio.volume;
    a.preload = 'none';
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, [available]);

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

  return { playing, toggle, available };
};
