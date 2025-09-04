import supabase from './supabase';
import type { Character } from '../components/molecules/CharacterCard/CharacterCard';

export async function fetchCharacters(): Promise<Character[]> {
  if (!supabase) return [];

  // Try characters table first
  try {
    const { data, error } = await supabase.from('characters').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        level: d.level ?? 1,
        stats: d.stats ?? undefined,
        avatarUrl: d.avatarUrl ?? d.avatar_url ?? undefined,
      }));
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
    return data.map((p: any) => ({
      id: p.id,
      name: p.name ?? p.playerName ?? p.id,
      level: p.level ?? 1,
      stats: p.stats ?? undefined,
      avatarUrl: p.avatarUrl ?? p.avatar_url ?? undefined,
    }));
  } catch (err) {
    console.warn('Failed to fetch players fallback', err);
    return [];
  }
}

export async function updateCharacterAvatar(characterId: string, avatarUrl: string): Promise<void> {
  if (!supabase) return;

  try {
    // Try updating characters table
    const { error: err1, count: count1 } = await supabase
      .from('characters')
      .update({ avatarUrl })
      .match({ id: characterId });

    if (!err1) return;

    // If updating characters failed, try players table (some projects store characters in players)
    const { error: err2 } = await supabase.from('players').update({ avatarUrl }).eq('id', characterId);
    if (!err2) return;

    // As a last resort, attempt upsert into characters table
    const { error: upsertErr } = await supabase.from('characters').upsert({ id: characterId, name: characterId, avatarUrl, level: 1 });
    if (upsertErr) console.warn('Failed upserting character with avatar', upsertErr);
  } catch (err) {
    console.warn('Failed updating character avatar in Supabase', err);
  }
}
