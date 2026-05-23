import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/config/env';

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!config.guestbook.enabled) return null;
  if (client) return client;
  client = createClient(
    config.guestbook.supabaseUrl,
    config.guestbook.supabaseAnonKey,
    { auth: { persistSession: false } },
  );
  return client;
};
