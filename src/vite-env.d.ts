/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string;

  readonly VITE_OWNER_NAME?: string;
  readonly VITE_OWNER_TITLE?: string;
  readonly VITE_OWNER_AVATAR?: string;
  readonly VITE_OWNER_BIO_EN?: string;
  readonly VITE_OWNER_BIO_ES?: string;

  readonly VITE_DEFAULT_LANGUAGE?: 'en' | 'es';
  readonly VITE_ANIMATIONS?: string;
  readonly VITE_DEFAULT_THEME?: 'light' | 'dark' | 'system';

  readonly VITE_LIGHT_BG?: string;
  readonly VITE_LIGHT_BG_SOFT?: string;
  readonly VITE_LIGHT_SURFACE?: string;
  readonly VITE_LIGHT_ACCENT?: string;
  readonly VITE_LIGHT_ACCENT_2?: string;
  readonly VITE_LIGHT_TEXT?: string;
  readonly VITE_LIGHT_TEXT_SOFT?: string;

  readonly VITE_DARK_BG?: string;
  readonly VITE_DARK_BG_SOFT?: string;
  readonly VITE_DARK_SURFACE?: string;
  readonly VITE_DARK_ACCENT?: string;
  readonly VITE_DARK_ACCENT_2?: string;
  readonly VITE_DARK_TEXT?: string;
  readonly VITE_DARK_TEXT_SOFT?: string;

  readonly VITE_CB_ACCENT?: string;
  readonly VITE_CB_ACCENT_2?: string;

  readonly VITE_SOCIAL_GITHUB?: string;
  readonly VITE_SOCIAL_LINKEDIN?: string;
  readonly VITE_SOCIAL_EMAIL?: string;
  readonly VITE_SOCIAL_X?: string;
  readonly VITE_SOCIAL_INSTAGRAM?: string;

  readonly VITE_MUSIC_ENABLED?: string;
  readonly VITE_MUSIC_FILE?: string;
  readonly VITE_MUSIC_VOLUME?: string;

  readonly VITE_FOOTER_TAGLINE?: string;

  readonly VITE_BACKGROUND_NEURONS?: string;

  readonly VITE_GUESTBOOK_ENABLED?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_GUESTBOOK_TABLE?: string;
  readonly VITE_GUESTBOOK_PUBLIC_VIEW?: string;
  readonly VITE_GUESTBOOK_NAME_MAX?: string;
  readonly VITE_GUESTBOOK_ROLE_MAX?: string;
  readonly VITE_GUESTBOOK_COMMENT_MAX?: string;
  readonly VITE_GUESTBOOK_EMAIL_MAX?: string;
  readonly VITE_GUESTBOOK_LIST_LIMIT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: (
    pattern: string,
    options?: { eager?: boolean; as?: string; query?: string; import?: string }
  ) => Record<string, string | { default: string }>;
}
