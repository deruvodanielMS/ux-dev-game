import { supabase } from '@/services/supabase';

import type { Player } from '@/types';

// Persist experience, level and defeated enemies. Safe no-op if no session.
export async function persistProgress(player: Player): Promise<void> {
  try {
    // Update profile simple fields (name/avatar/email) via existing helper if needed
    // Here we focus on experience, level, defeated_enemies
    if (!supabase) return;
    const session = await supabase.auth.getSession();
    if (!session.data.session) return; // no supabase auth session -> skip

    const payload: Record<string, unknown> = {
      experience: player.experience,
      level: player.level,
      defeated_enemies: player.defeatedEnemies || [],
    };

    // Attempt by numeric id first
    const numericId = /^\d+$/.test(player.id);
    if (numericId) {
      const { error } = await supabase
        .from('players')
        .update(payload)
        .eq('id', player.id);
      if (!error) return;
    }

    // Fallback by slug (external auth id)
    const { error: slugErr } = await supabase
      .from('players')
      .update(payload)
      .eq('slug', player.id);
    if (!slugErr) return;

    // Last resort: upsert using slug
    await supabase
      .from('players')
      .upsert(
        numericId
          ? { id: player.id, slug: player.id, ...payload }
          : { slug: player.id, ...payload },
        { onConflict: 'slug' },
      );
  } catch {
    // silent: offline or RLS restriction
  }
}
