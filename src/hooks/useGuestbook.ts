import { useCallback, useEffect, useState } from 'react';
import { config } from '@/config/env';
import { getSupabase } from '@/lib/supabase';

export interface GuestbookEntry {
  id: number;
  created_at: string;
  full_name: string;
  role: string | null;
  comment: string;
}

export interface NewEntry {
  email: string;
  full_name: string;
  role: string;
  comment: string;
}

interface State {
  entries: GuestbookEntry[];
  loading: boolean;
  loadError: boolean;
}

export const useGuestbook = () => {
  const [state, setState] = useState<State>({
    entries: [],
    loading: config.guestbook.enabled,
    loadError: false,
  });

  const fetchEntries = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setState((s) => ({ ...s, loading: true, loadError: false }));
    const { data, error } = await supabase
      .from(config.guestbook.publicView)
      .select('id, created_at, full_name, role, comment')
      .order('created_at', { ascending: false })
      .limit(config.guestbook.listLimit);
    if (error) {
      setState({ entries: [], loading: false, loadError: true });
      return;
    }
    setState({
      entries: (data ?? []) as GuestbookEntry[],
      loading: false,
      loadError: false,
    });
  }, []);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  const submit = useCallback(
    async (entry: NewEntry): Promise<{ ok: true } | { ok: false; reason: string }> => {
      console.log('[guestbook] submit() start');
      const supabase = getSupabase();
      console.log('[guestbook] supabase client =', supabase ? 'OK' : 'NULL');
      if (!supabase) return { ok: false, reason: 'disabled' };
      const payload = {
        email: entry.email.trim(),
        full_name: entry.full_name.trim(),
        role: entry.role.trim().length > 0 ? entry.role.trim() : null,
        comment: entry.comment.trim(),
      };
      console.log('[guestbook] inserting into', config.guestbook.table, payload);
      const response = await supabase.from(config.guestbook.table).insert(payload);
      console.log('[guestbook] insert response', response);
      if (response.error) return { ok: false, reason: response.error.message };
      await fetchEntries();
      return { ok: true };
    },
    [fetchEntries],
  );

  return { ...state, submit, refresh: fetchEntries };
};
