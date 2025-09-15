import { resolveAvatarUrl } from '@/services/avatars';
import { supabase } from '@/services/supabase';

import type { Character } from '@/types';

// Shape coming from DB rows (loose) before mapping to Character
type RawCharacterRow = {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  avatar_path?: string | null;
  avatar_path_url?: string | null;
  stats?: Character['stats'];
  abilities?: Character['abilities'];
};

type RawPlayerRow = {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  avatar_path?: string | null;
  avatar_path_url?: string | null;
  stats?: Character['stats'];
  abilities?: Character['abilities'];
};

function extractAvatar(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  return raw.startsWith('http') ? raw : undefined; // resolved later if needed
}

export async function getCharacters(): Promise<Character[]> {
  if (!supabase) return [];

  // Try characters table first
  try {
    const { data, error } = await supabase.from('characters').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = await Promise.all(
        (data as RawCharacterRow[]).map(async (d) => {
          const raw =
            d.avatarUrl ?? d.avatar_url ?? d.avatar_path ?? d.avatar_path_url;
          let avatarUrl = extractAvatar(raw);
          if (!avatarUrl && raw) {
            try {
              const resolved = await resolveAvatarUrl(raw);
              if (resolved) avatarUrl = resolved;
            } catch {
              /* ignore */
            }
          }
          return {
            id: d.id,
            name: d.name || d.id,
            avatar: avatarUrl,
            stats: d.stats ?? { hp: 100, attack: 10, defense: 10, speed: 50 },
            abilities: d.abilities ?? [],
          } as Character;
        }),
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
      throw error;
    }
    if (Array.isArray(data)) {
      const mapped = await Promise.all(
        (data as RawPlayerRow[]).map(async (p) => {
          const raw =
            p.avatarUrl ?? p.avatar_url ?? p.avatar_path ?? p.avatar_path_url;
          let avatarUrl = extractAvatar(raw);
          if (!avatarUrl && raw) {
            try {
              const resolved = await resolveAvatarUrl(raw);
              if (resolved) avatarUrl = resolved;
            } catch {
              /* ignore */
            }
          }
          return {
            id: p.id,
            name: p.name || p.id,
            avatar: avatarUrl,
            stats: p.stats ?? { hp: 100, attack: 10, defense: 10, speed: 50 },
            abilities: p.abilities ?? [],
          } as Character;
        }),
      );
      return mapped;
    }
    return [];
  } catch (err) {
    console.warn('Error querying players table:', err);
    return [];
  }
}

export async function updateCharacterAvatar(
  characterId: string,
  avatarUrl: string,
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  // Try updating characters table (snake_case avatar_url)
  const { error: err1, count: count1 } = await supabase
    .from('characters')
    .update({ avatar_url: avatarUrl })
    .match({ id: characterId });

  if (!err1 && (count1 ?? 0) > 0) return;

  // Try players table (some projects store characters in players)
  const { error: err2, count: count2 } = await supabase
    .from('players')
    .update({ avatar_url: avatarUrl })
    .eq('id', characterId);
  if (!err2 && (count2 ?? 0) > 0) return;

  // As a last resort, attempt upsert into characters table
  const userRes = await supabase.auth.getUser();
  const user = userRes.data?.user ?? null;
  const upsertPayload: {
    id: string;
    name: string;
    avatar_url: string;
    level: number;
    slug?: string;
  } = {
    id: characterId,
    name: characterId,
    avatar_url: avatarUrl,
    level: 1,
  };
  if (user?.id) upsertPayload.slug = characterId;
  const { error: err3 } = await supabase
    .from('characters')
    .upsert(upsertPayload);
  if (err3) console.warn('Upsert failed:', err3);
}
