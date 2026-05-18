import { useEffect, useRef } from 'react';

interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

const NEURON_COUNT = 130;
const MAX_DIST = 190;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

const readRgbVar = (name: string): [number, number, number] => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = raw.split(/[\s,]+/).map(Number).filter((n) => !Number.isNaN(n));
  if (parts.length >= 3) return [parts[0], parts[1], parts[2]];
  return [168, 85, 247];
};

export const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let accent = readRgbVar('--accent');
    let accent2 = readRgbVar('--accent-2');
    const themeObserver = new MutationObserver(() => {
      accent = readRgbVar('--accent');
      accent2 = readRgbVar('--accent-2');
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';

    const neurons: Neuron[] = Array.from({ length: NEURON_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: 1.6 + Math.random() * 2.6,
      baseAlpha: 0.5 + Math.random() * 0.4,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.018,
    }));

    let raf = 0;
    let paused = document.hidden;

    const onVisibilityChange = () => {
      paused = document.hidden;
      if (!paused) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const draw = () => {
      if (paused) return;
      ctx.clearRect(0, 0, width, height);

      const light = isLight();
      const lineBase = light ? 0.32 : 0.45;
      const nodeBase = light ? 0.55 : 0.85;

      for (const n of neurons) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulsePhase += n.pulseSpeed;
        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
      }

      ctx.lineWidth = 1.2;
      for (let i = 0; i < neurons.length; i++) {
        const a = neurons[i];
        for (let j = i + 1; j < neurons.length; j++) {
          const b = neurons[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > MAX_DIST_SQ) continue;
          const dist = Math.sqrt(distSq);
          const t = 1 - dist / MAX_DIST;
          const alpha = t * t * lineBase;
          if (alpha < 0.02) continue;
          const [r, g, bl] = t > 0.5 ? accent : accent2;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      const [nr, ng, nb] = accent;
      for (const n of neurons) {
        const pulse = 0.5 + 0.5 * Math.sin(n.pulsePhase);
        const alpha = n.baseAlpha * nodeBase * (0.55 + pulse * 0.45);
        const radius = n.r * (0.85 + pulse * 0.3);
        ctx.shadowColor = `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
        ctx.shadowBlur = 10 + pulse * 8;
        ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -2 }}
    />
  );
};
