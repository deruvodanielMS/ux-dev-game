export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  exp: number;
  coins: number;
  softSkills: number;
  techSkills: number;
  coreValues: number;
  creativity: number;
  aiLevel: number;
  characterId: string;
}

const API_URL = '/api/players';
const LS_KEY = 'duelo_players_v1';

function readFromLocalStorage(): Player[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Player[];
  } catch {
    return [];
  }
}

function writeToLocalStorage(players: Player[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(players));
  } catch {
    // ignore persistence errors
  }
}

export async function fetchPlayers(): Promise<Player[]> {
  try {
    const res = await fetch(API_URL, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Player[];
    return Array.isArray(data) ? data : [];
  } catch {
    return readFromLocalStorage();
  }
}

export async function savePlayer(player: Player): Promise<Player> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(player),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const saved = (await res.json()) as Player;
    return saved;
  } catch {
    const existing = readFromLocalStorage();
    const idx = existing.findIndex((p) => p.id === player.id);
    if (idx >= 0) existing[idx] = player; else existing.push(player);
    writeToLocalStorage(existing);
    return player;
  }
}

export async function upsertPlayers(players: Player[]): Promise<Player[]> {
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(players),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const saved = (await res.json()) as Player[];
    return Array.isArray(saved) ? saved : players;
  } catch {
    const current = readFromLocalStorage();
    const map = new Map<string, Player>(current.map((p) => [p.id, p]));
    for (const p of players) map.set(p.id, p);
    const merged = Array.from(map.values());
    writeToLocalStorage(merged);
    return merged;
  }
}

// Update avatar URL for a player locally and in Supabase if available
import supabase from './supabase';

export async function updatePlayerAvatar(authUid: string, avatarUrl: string): Promise<void> {
  // Update local storage copy if a local player with same id exists
  const current = readFromLocalStorage();
  const idx = current.findIndex((p) => p.id === authUid);
  if (idx >= 0) {
    current[idx] = { ...current[idx], avatarUrl };
    writeToLocalStorage(current);
  }

  if (!supabase) return;

  try {
    // 1) Try update by id (uuid) using snake_case avatar_url
    const { error: err1, count: count1 } = await supabase
      .from('players')
      .update({ avatar_url: avatarUrl })
      .eq('id', authUid);

    if (!err1 && (count1 ?? 0) > 0) return;

    // 2) Try update by slug (some tables use slug text identifiers)
    const { error: err2, count: count2 } = await supabase
      .from('players')
      .update({ avatar_url: avatarUrl })
      .eq('slug', authUid);

    if (!err2 && (count2 ?? 0) > 0) return;

    // 3) Fallback: upsert a player record using authUid as id so the avatar is associated (snake_case)
    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user ?? null;
    const name = user?.email ?? authUid;
    const payload: any = { id: authUid, name, avatar_url: avatarUrl, level: 1 };
    // include slug so future lookups by slug may work
    payload.slug = authUid;
    const { error: upsertErr } = await supabase.from('players').upsert(payload);
    if (upsertErr) console.warn('Failed upserting player with avatar', upsertErr);
  } catch (err) {
    console.warn('Failed updating avatar in Supabase', err);
  }
}

export function sortPlayersForLadder(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.exp !== a.exp) return b.exp - a.exp;
    return a.name.localeCompare(b.name);
  });
}
