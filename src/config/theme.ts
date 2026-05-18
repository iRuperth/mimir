import { config } from './env';

const hexToRgb = (hex: string): string => {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
};

const buildVars = (palette: Record<string, string>) => {
  const rules: string[] = [];
  for (const [key, value] of Object.entries(palette)) {
    const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    rules.push(`--${cssKey}: ${hexToRgb(value)};`);
  }
  return rules.join(' ');
};

export const injectThemeStyles = () => {
  const id = 'mimir-theme-vars';
  if (document.getElementById(id)) return;

  const { light, dark, colorblind } = config.theme;
  const css = `
    :root,
    [data-theme="light"] { ${buildVars(light)} }
    [data-theme="dark"]  { ${buildVars(dark)} }
    [data-cb="true"]     {
      --accent: ${hexToRgb(colorblind.accent)};
      --accent-2: ${hexToRgb(colorblind.accent2)};
    }
  `;

  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
};
