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

  let lastError: any = null;
  try {
    // 1) Try update by id (uuid) using snake_case avatar_url
    const res1 = await supabase.from('players').update({ avatar_url: avatarUrl }).eq('id', authUid);
    if (!res1.error) return; // success
    lastError = res1.error;

    // 2) Try update by slug (some tables use slug text identifiers)
    const res2 = await supabase.from('players').update({ avatar_url: avatarUrl }).eq('slug', authUid);
    if (!res2.error) return; // success
    lastError = res2.error;

    // 3) Fallback: upsert a player record using authUid as id so the avatar is associated (snake_case)
    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user ?? null;
    const name = user?.email ?? authUid;
    const email = user?.email ?? authUid;
    const payload: any = { id: authUid, name, email, avatar_url: avatarUrl, level: 1, slug: authUid };
    const upsertRes = await supabase.from('players').upsert(payload);
    if (!upsertRes.error) return; // success
    lastError = upsertRes.error;

    // all attempts failed
    const err = new Error(lastError?.message ?? 'Failed to update avatar');
    (err as any).original = lastError;
    throw err;
  } catch (err) {
    // surface error to caller
    throw err;
  }
}

export async function updatePlayerProfile(authUid: string, data: { name?: string | null; email?: string | null }): Promise<void> {
  // Update local storage copy if a local player with same id exists
  const current = readFromLocalStorage();
  const idx = current.findIndex((p) => p.id === authUid);
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...(data.name !== undefined ? { name: data.name } : {}), ...(data.email !== undefined ? { email: data.email } : {}) } as Player;
    writeToLocalStorage(current);
  }

  if (!supabase) return;

  let lastError: any = null;
  try {
    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.email !== undefined) payload.email = data.email;

    if (Object.keys(payload).length === 0) return;

    // 1) Try update by id
    const res1 = await supabase.from('players').update(payload).eq('id', authUid);
    if (!res1.error) return; // success
    lastError = res1.error;

    // 2) Try update by slug
    const res2 = await supabase.from('players').update(payload).eq('slug', authUid);
    if (!res2.error) return; // success
    lastError = res2.error;

    // 3) Fallback: upsert a player record using authUid as id
    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user ?? null;
    const name = data.name ?? user?.email ?? authUid;
    const upsertPayload: any = { id: authUid, name, email: data.email ?? user?.email ?? null, slug: authUid };
    const upsertRes = await supabase.from('players').upsert(upsertPayload);
    if (!upsertRes.error) return; // success
    lastError = upsertRes.error;

    // all attempts failed
    const err = new Error(lastError?.message ?? 'Failed to update profile');
    (err as any).original = lastError;
    throw err;
  } catch (err) {
    throw err;
  }
}

export function sortPlayersForLadder(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.exp !== a.exp) return b.exp - a.exp;
    return a.name.localeCompare(b.name);
  });
}
