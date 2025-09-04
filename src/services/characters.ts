import supabase from './supabase';
import type { Character } from '../components/molecules/CharacterCard/CharacterCard';

export async function fetchCharacters(): Promise<Character[]> {
  // If supabase client not configured, return empty array
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.from('characters').select('*');
    if (error) {
      console.warn('Error fetching characters from Supabase', error);
      return [];
    }
    // Map data to Character type
    return (data ?? []).map((d: any) => ({ id: d.id, name: d.name, level: d.level ?? 1, stats: d.stats ?? undefined }));
  } catch (err) {
    console.warn('Failed to fetch characters', err);
    return [];
  }
}
