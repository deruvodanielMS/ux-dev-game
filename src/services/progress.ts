import { supabase } from '@/services/supabase';

declare global {
  interface Window {
    __net?: { start?: () => void; end?: () => void };
  }
}

import type { Player } from '@/types';

// Persist experience, level and defeated enemies. Safe no-op if no session.
export async function persistProgress(player: Player): Promise<void> {
  try {
    window.__net?.start?.();
    if (!supabase) return;
    // Intentamos igual, aunque no haya sesión; si RLS bloquea, simplemente falla silencioso
    const payload: Record<string, unknown> = {
      experience: player.experience,
      level: player.level,
      defeated_enemies: player.defeatedEnemies || [],
      ...(player.stats ? { stats: player.stats } : {}),
    };
    const numericId = /^\d+$/.test(player.id);
    if (numericId) {
      const { error } = await supabase
        .from('players')
        .update(payload)
        .eq('id', player.id);
      if (!error) return;
    }
    const { error: slugErr } = await supabase
      .from('players')
      .update(payload)
      .eq('slug', player.id);
    if (!slugErr) return;
    await supabase
      .from('players')
      .upsert(
        numericId
          ? { id: player.id, slug: player.id, ...payload }
          : { slug: player.id, ...payload },
        { onConflict: 'slug' },
      );
  } catch {
    // silent
  } finally {
    window.__net?.end?.();
  }
}
