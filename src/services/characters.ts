import supabase from './supabase';
import type { Character } from '../components/molecules/CharacterCard/CharacterCard';
import { resolveAvatarUrl } from './avatars';

export async function fetchCharacters(): Promise<Character[]> {
  if (!supabase) return [];

  // Try characters table first
  try {
    const { data, error } = await supabase.from('characters').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = await Promise.all(
        data.map(async (d: any) => {
          const raw = d.avatarUrl ?? d.avatar_url ?? d.avatar_path ?? d.avatar_path_url ?? undefined;
          const avatarUrl = raw ? (raw.startsWith('http') ? raw : await resolveAvatarUrl(raw)) : undefined;
          return { id: d.id, name: d.name, level: d.level ?? 1, stats: d.stats ?? undefined, avatarUrl, last_pr_at: d.last_pr_at ?? d.lastPrAt ?? d.last_pr_date ?? d.last_pr_date, ai_level: d.ai_level ?? d.aiLevel ?? (d.stats?.ai_level ?? undefined) } as Character;
        })
      );
      return mapped;
    }
  } catch (err) {
    console.warn('Error querying characters table:', err);
  }

  // Fallback: try players table (map players to character shape)
  try {
    const { data, error } = await supabase.from('players').select('*');
    if (error) {
      console.warn('Error fetching players as characters', error);
      return [];
    }
    if (!Array.isArray(data) || data.length === 0) return [];

    const mapped = await Promise.all(
      data.map(async (p: any) => {
        const raw = p.avatarUrl ?? p.avatar_url ?? p.avatar_path ?? undefined;
        const avatarUrl = raw ? (raw.startsWith('http') ? raw : await resolveAvatarUrl(raw)) : undefined;
        return { id: p.id, name: p.name ?? p.playerName ?? p.id, level: p.level ?? 1, stats: p.stats ?? undefined, avatarUrl, last_pr_at: p.last_pr_at ?? p.lastPrAt ?? p.last_pr_date ?? p.last_pr_date, ai_level: p.ai_level ?? p.aiLevel ?? (p.stats?.ai_level ?? undefined) } as Character;
      })
    );

    return mapped;
  } catch (err) {
    console.warn('Failed to fetch players fallback', err);
    return [];
  }
}

export async function updateCharacterAvatar(characterId: string, avatarUrl: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  // Try updating characters table (snake_case avatar_url)
  const { error: err1, count: count1 } = await supabase
    .from('characters')
    .update({ avatar_url: avatarUrl })
    .match({ id: characterId });

  if (!err1 && (count1 ?? 0) > 0) return;

  // Try players table (some projects store characters in players)
  const { error: err2, count: count2 } = await supabase.from('players').update({ avatar_url: avatarUrl }).eq('id', characterId);
  if (!err2 && (count2 ?? 0) > 0) return;

  // As a last resort, attempt upsert into characters table
  const userRes = await supabase.auth.getUser();
  const user = userRes.data?.user ?? null;
  const upsertPayload: any = { id: characterId, name: characterId, avatar_url: avatarUrl, level: 1 };
  if (user?.id) upsertPayload.slug = characterId;
  const { error: upsertErr } = await supabase.from('characters').upsert(upsertPayload);
  if (upsertErr) {
    // throw so caller can show a meaningful error to the user and we can debug RLS issues
    throw upsertErr;
  }
}
