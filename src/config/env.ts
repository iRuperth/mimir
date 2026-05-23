const e = import.meta.env;

const bool = (v: string | undefined, fallback = false): boolean => {
  if (v == null) return fallback;
  return v.toLowerCase() === 'true' || v === '1';
};

const str = (v: string | undefined, fallback: string): string =>
  v && v.length > 0 ? v : fallback;

const num = (v: string | undefined, fallback: number): number => {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
};

/* Resolve a public asset path to a URL the browser can fetch. The dev
   server (and the GitHub Pages build) live under a base path
   (/mimir/), so a raw "/avatar.jpeg" in .env would 404. Prepend the
   base so the user can write paths relative to public/ and have them
   work in any deploy target. Absolute URLs (http/https) and data:
   URIs are returned untouched. */
const asset = (v: string | undefined): string => {
  if (!v || v.length === 0) return '';
  if (/^(https?:|data:)/i.test(v)) return v;
  const base = (e.BASE_URL || '/').replace(/\/$/, '');
  return base + (v.startsWith('/') ? v : `/${v}`);
};

export const config = {
  basePath: str(e.VITE_BASE_PATH, '/'),

  owner: {
    name: str(e.VITE_OWNER_NAME, 'Your Name'),
    title: str(e.VITE_OWNER_TITLE, 'Developer'),
    avatar: asset(e.VITE_OWNER_AVATAR),
    bio: {
      en: str(e.VITE_OWNER_BIO_EN, ''),
      es: str(e.VITE_OWNER_BIO_ES, ''),
    },
  },

  language: {
    default: (e.VITE_DEFAULT_LANGUAGE ?? 'en') as 'en' | 'es',
  },

  features: {
    animations: bool(e.VITE_ANIMATIONS, true),
    music: bool(e.VITE_MUSIC_ENABLED, false),
  },

  theme: {
    default: (e.VITE_DEFAULT_THEME ?? 'dark') as 'light' | 'dark' | 'system',
    light: {
      bg: str(e.VITE_LIGHT_BG, '#ffffff'),
      bgSoft: str(e.VITE_LIGHT_BG_SOFT, '#f5f5f7'),
      surface: str(e.VITE_LIGHT_SURFACE, '#c8c8d0'),
      accent: str(e.VITE_LIGHT_ACCENT, '#7c3aed'),
      accent2: str(e.VITE_LIGHT_ACCENT_2, '#a855f7'),
      text: str(e.VITE_LIGHT_TEXT, '#1a1a1a'),
      textSoft: str(e.VITE_LIGHT_TEXT_SOFT, '#52525b'),
    },
    dark: {
      bg: str(e.VITE_DARK_BG, '#0d1117'),
      bgSoft: str(e.VITE_DARK_BG_SOFT, '#161b22'),
      surface: str(e.VITE_DARK_SURFACE, '#21262d'),
      accent: str(e.VITE_DARK_ACCENT, '#a855f7'),
      accent2: str(e.VITE_DARK_ACCENT_2, '#c084fc'),
      text: str(e.VITE_DARK_TEXT, '#f0f6fc'),
      textSoft: str(e.VITE_DARK_TEXT_SOFT, '#8b949e'),
    },
    colorblind: {
      accent: str(e.VITE_CB_ACCENT, '#0072B2'),
      accent2: str(e.VITE_CB_ACCENT_2, '#E69F00'),
    },
  },

  socials: {
    github: str(e.VITE_SOCIAL_GITHUB, ''),
    linkedin: str(e.VITE_SOCIAL_LINKEDIN, ''),
    email: str(e.VITE_SOCIAL_EMAIL, ''),
    phone: str(e.VITE_SOCIAL_PHONE, ''),
    x: str(e.VITE_SOCIAL_X, ''),
    instagram: str(e.VITE_SOCIAL_INSTAGRAM, ''),
  },

  audio: {
    file: asset(e.VITE_MUSIC_FILE),
    volume: Math.min(1, Math.max(0, num(e.VITE_MUSIC_VOLUME, 0.3))),
  },

  footer: {
    tagline: str(e.VITE_FOOTER_TAGLINE, ''),
  },

  guestbook: {
    enabled:
      bool(e.VITE_GUESTBOOK_ENABLED, false) &&
      (e.VITE_SUPABASE_URL ?? '').length > 0 &&
      (e.VITE_SUPABASE_ANON_KEY ?? '').length > 0,
    supabaseUrl: str(e.VITE_SUPABASE_URL, ''),
    supabaseAnonKey: str(e.VITE_SUPABASE_ANON_KEY, ''),
    table: str(e.VITE_GUESTBOOK_TABLE, 'guestbook'),
    publicView: str(e.VITE_GUESTBOOK_PUBLIC_VIEW, 'guestbook_public'),
    limits: {
      email: Math.max(3, num(e.VITE_GUESTBOOK_EMAIL_MAX, 254)),
      name: Math.max(1, num(e.VITE_GUESTBOOK_NAME_MAX, 80)),
      role: Math.max(1, num(e.VITE_GUESTBOOK_ROLE_MAX, 80)),
      comment: Math.max(1, num(e.VITE_GUESTBOOK_COMMENT_MAX, 500)),
    },
    listLimit: Math.max(1, num(e.VITE_GUESTBOOK_LIST_LIMIT, 50)),
  },
} as const;

export type AppConfig = typeof config;
