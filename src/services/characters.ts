import supabase from './supabase';
import type { Character } from '../components/molecules/CharacterCard/CharacterCard';

export async function fetchCharacters(): Promise<Character[]> {
  if (!supabase) return [];

  // Try characters table first
  try {
    const { data, error } = await supabase.from('characters').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((d: any) => ({ id: d.id, name: d.name, level: d.level ?? 1, stats: d.stats ?? undefined }));
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
    return data.map((p: any) => ({ id: p.id, name: p.name ?? p.playerName ?? p.id, level: p.level ?? 1, stats: p.stats ?? undefined }));
  } catch (err) {
    console.warn('Failed to fetch players fallback', err);
    return [];
  }
}
