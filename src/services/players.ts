import { publicAvatarUrlFor, sanitizeStorageKey } from '@/services/avatars';
import { supabase } from '@/services/supabase';

import type { Player } from '@/types';

// Removed API_URL; direct Supabase access (read-only) is used now.
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

export async function getPlayer(id: string): Promise<Player | null> {
  const players = await fetchPlayers();
  const player = players.find((p) => p.id === id);
  // Mock player data if not found for demonstration
  if (!player) {
    return {
      id: '1',
      name: 'Dev Player',
      level: 1,
      experience: 0,
      characters: [],
      inventory: {
        items: [],
        cards: [],
      },
      progress: {
        currentLevelId: '1',
        completedLevels: [],
      },
    };
  }
  return player || null;
}

export async function fetchPlayers(): Promise<Player[]> {
  // Attempt direct Supabase read (anon public RLS must allow SELECT or a policy for public stats)
  try {
    if (!supabase) throw new Error('Supabase client not configured');
    const { data, error } = await supabase
      .from('players')
      .select(
        'id, slug, name, level, experience, avatar_url, defeated_enemies, stats',
      )
      .limit(200);
    if (error) throw error;
    if (!data) return readFromLocalStorage();
    // Map fields to Player shape partially; preserve unknown fields gracefully
    type PlayerRow = {
      id: string;
      slug?: string | null;
      name?: string | null;
      level?: number | null;
      experience?: number | null;
      avatar_url?: string | null;
      defeated_enemies?: string[] | null;
      stats?: Record<string, number> | null;
    };
    return data.map((row: PlayerRow) => {
      const existing = readFromLocalStorage().find((p) => p.id === row.id);
      let avatarUrl = row.avatar_url || existing?.avatarUrl || null;
      // Fallback: si no hay avatar_url pero conocemos el slug (o id) intentamos construir ruta determinista
      if (!avatarUrl) {
        const baseId = row.slug || row.id;
        if (baseId) {
          const safe = sanitizeStorageKey(baseId);
          // intentamos extensiones comunes; primera que exista se usa
          const exts = ['png', 'jpg', 'jpeg', 'webp'];
          for (const ext of exts) {
            const candidatePath = `${safe}/avatar.${ext}`;
            const url = publicAvatarUrlFor(candidatePath);
            // No podemos HEAD sincrónico aquí; asumimos png/jpg etc. Si no existe el servidor devolverá 404, la UI lo mostrará roto y forzará update real.
            if (url) {
              avatarUrl = url;
              break;
            }
          }
        }
      }
      // Normalize: if rawPath exists and looks relative, build full URL and overwrite path with full URL (new convention)
      if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
        const full = publicAvatarUrlFor(avatarUrl);
        if (full) {
          if (!avatarUrl) avatarUrl = full;
        }
      }

      return {
        id: row.id,
        slug: row.slug || existing?.slug || null,
        name: row.name || existing?.name || 'Jugador',
        level: row.level || existing?.level || 1,
        experience: row.experience || existing?.experience || 0,

        avatarUrl,
        defeatedEnemies:
          row.defeated_enemies || existing?.defeatedEnemies || [],
        characters: existing?.characters || [],
        inventory: existing?.inventory || { items: [], cards: [] },
        progress: existing?.progress || {
          currentLevelId: '1',
          completedLevels: [],
        },
        stats: row.stats || existing?.stats || {},
      } as Player;
    });
  } catch {
    return readFromLocalStorage();
  }
}

// Fetch a single player by id or slug (tries id first then slug) returning partial Player shape
export async function fetchPlayerById(id: string): Promise<Player | null> {
  try {
    if (!supabase) return null;
    const isNumeric = /^\d+$/.test(id);
    const selectCols =
      'id, slug, name, level, experience, avatar_url, defeated_enemies, stats';
    let row: RemotePlayerRow | null = null;
    if (isNumeric) {
      const { data, error } = await supabase
        .from('players')
        .select(selectCols)
        .eq('id', id)
        .maybeSingle();
      if (!error && data) row = data; // else fallback to slug
    }
    if (!row) {
      const { data, error } = await supabase
        .from('players')
        .select(selectCols)
        .eq('slug', id)
        .maybeSingle();
      if (!error && data) row = data;
    }
    if (!row) return null;
    let avatarUrl = row.avatar_url || null;
    if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
      const full = publicAvatarUrlFor(avatarUrl);
      if (full) avatarUrl = full;
    }
    return {
      id: row.id || row.slug || id,
      slug: row.slug || null,
      name: row.name || 'Jugador',
      level: row.level || 1,
      experience: row.experience || 0,
      avatarUrl,
      defeatedEnemies: row.defeated_enemies || [],
      characters: [],
      inventory: { items: [], cards: [] },
      progress: { currentLevelId: '1', completedLevels: [] },
      stats: row.stats || {},
    } as Player;
  } catch {
    return null;
  }
}

// Ensure a remote player record exists for the authenticated user (Auth0) using slug=auth user id.
// Returns a partial Player (remote authoritative fields) or null if not possible.
export async function ensureRemotePlayerRecord(params: {
  id: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}): Promise<Partial<Player> | null> {
  const { id, name, email, picture } = params;
  if (!id) return null;
  if (!supabase) return null; // cannot ensure without supabase client
  try {
    // 1) Try fetch existing by slug (external auth id)
    const { data: existingBySlug, error: fetchSlugErr } = await supabase
      .from('players')
      .select(
        'id, slug, name, level, experience, avatar_url, defeated_enemies, stats',
      )
      .eq('slug', id)
      .maybeSingle();
    if (!fetchSlugErr && existingBySlug) {
      return mapRemoteRowToPlayerPartial(existingBySlug);
    }

    // 2) If not found by slug, optionally try by id if numeric
    if (/^\d+$/.test(id)) {
      const { data: existingById, error: fetchIdErr } = await supabase
        .from('players')
        .select(
          'id, slug, name, level, experience, avatar_url, defeated_enemies, stats',
        )
        .eq('id', id)
        .maybeSingle();
      if (!fetchIdErr && existingById) {
        return mapRemoteRowToPlayerPartial(existingById);
      }
    }

    // 3) Not found → create via upsert (slug conflict key)
    const upsertPayload: Record<string, unknown> = {
      slug: id,
      name: name || email || 'Jugador',
      email: email || null,
      avatar_url: picture || null,
      // start with base progression if table allows these fields
      level: 1,
      experience: 0,
      defeated_enemies: [],
    };
    await supabase
      .from('players')
      .upsert(upsertPayload, { onConflict: 'slug' });

    // 4) Fetch again to return authoritative values
    const { data: after, error: afterErr } = await supabase
      .from('players')
      .select(
        'id, slug, name, level, experience, avatar_url, defeated_enemies, stats',
      )
      .eq('slug', id)
      .maybeSingle();
    if (afterErr || !after) return null;
    return mapRemoteRowToPlayerPartial(after);
  } catch {
    return null; // silent failure (offline / RLS)
  }
}

type RemotePlayerRow = {
  id?: string;
  slug?: string | null;
  name?: string | null;
  level?: number | null;
  experience?: number | null;
  avatar_url?: string | null;
  defeated_enemies?: string[] | null;
  stats?: Record<string, number> | null;
};

function mapRemoteRowToPlayerPartial(row: RemotePlayerRow): Partial<Player> {
  let avatarUrl = row.avatar_url || null;
  if (!avatarUrl) {
    const baseId = row.slug || row.id;
    if (baseId) {
      const safe = sanitizeStorageKey(baseId);
      const exts = ['png', 'jpg', 'jpeg', 'webp'];
      for (const ext of exts) {
        const candidatePath = `${safe}/avatar.${ext}`;
        const url = publicAvatarUrlFor(candidatePath);
        if (url) {
          avatarUrl = url;
          break;
        }
      }
    }
  }
  if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
    const full = publicAvatarUrlFor(avatarUrl);
    if (full) avatarUrl = full;
  }
  return {
    id: row.id || row.slug || '',
    slug: row.slug || null,
    name: row.name || undefined,
    level: row.level || undefined,
    experience: row.experience || undefined,
    avatarUrl,
    defeatedEnemies: row.defeated_enemies || undefined,
    stats: row.stats || undefined,
  } as Partial<Player>;
}

export async function savePlayer(player: Player): Promise<Player> {
  // No backend write; just persist locally (Supabase write restricted without auth session)
  const existing = readFromLocalStorage();
  const idx = existing.findIndex((p) => p.id === player.id);
  if (idx >= 0) existing[idx] = player;
  else existing.push(player);
  writeToLocalStorage(existing);
  return player;
}

export async function upsertPlayers(players: Player[]): Promise<Player[]> {
  // Local merge only (no backend upsert)
  const current = readFromLocalStorage();
  const map = new Map<string, Player>(current.map((p) => [p.id, p]));
  for (const p of players) map.set(p.id, p);
  const merged = Array.from(map.values());
  writeToLocalStorage(merged);
  return merged;
}

function isNumericId(value: string): boolean {
  return /^\d+$/.test(value);
}

// Update avatar URL for a player locally and in Supabase if available
export async function updatePlayerAvatar(
  id: string,
  uploadedPathOrUrl: string,
): Promise<void> {
  // actualizar localStorage si existe
  const current = readFromLocalStorage();
  const idx = current.findIndex((p) => p.id === id);
  let fullUrl = uploadedPathOrUrl;
  if (uploadedPathOrUrl && !/^https?:\/\//i.test(uploadedPathOrUrl)) {
    const built = publicAvatarUrlFor(uploadedPathOrUrl);
    if (built) fullUrl = built;
  }
  if (idx >= 0) {
    current[idx] = {
      ...current[idx],
      slug: current[idx].slug || id, // mantener slug para usuarios creados por slug
      avatarPath: fullUrl,
      avatarUrl: fullUrl,
    } as Player;
    writeToLocalStorage(current);
  }
  if (!supabase) return;
  window.__net?.start?.();
  try {
    const updatePayload = { avatar_url: fullUrl };
    console.debug(
      '[avatar] intentando persistir avatar_url (evitando PATCH CORS)',
      {
        id,
        fullUrl,
      },
    );
    // 0) Intentar RPC set_player_avatar (requiere que hayas creado la función SQL)
    try {
      const rpcRes = await supabase.rpc('set_player_avatar', {
        p_slug: id,
        p_avatar_url: fullUrl,
      });
      if (!rpcRes.error) {
        console.debug('[avatar] RPC set_player_avatar ok');
        return;
      }
      console.warn(
        '[avatar] RPC set_player_avatar falló, sigo con upsert',
        rpcRes.error.message,
      );
    } catch (e) {
      console.warn(
        '[avatar] excepción en RPC set_player_avatar',
        (e as Error).message,
      );
    }
    // Estrategia: usar únicamente UPSERT (POST) para evitar método PATCH bloqueado por CORS.
    // Prioridad slug (id externo) para no duplicar registros; si es numérico y existe constraint por id también funcionará.
    const slugUpsert = { slug: id, ...updatePayload };
    const numericUpsert = isNumericId(id)
      ? { id, slug: id, ...updatePayload }
      : null;

    // 1) Intentar upsert por slug (onConflict=slug) -> POST
    let res = await supabase
      .from('players')
      .upsert(slugUpsert, { onConflict: 'slug' });
    if (!res.error) {
      console.debug('[avatar] upsert por slug ok (POST)');
      return;
    }
    console.warn(
      '[avatar] fallo upsert por slug, intentando variante numérica',
      res.error.message,
    );

    // 2) Si id numérico, intentar upsert incluyendo id (onConflict=slug mantiene unicidad principal)
    if (numericUpsert) {
      res = await supabase
        .from('players')
        .upsert(numericUpsert, { onConflict: 'slug' });
      if (!res.error) {
        console.debug('[avatar] upsert numérico ok (POST)');
        return;
      }
      console.warn('[avatar] fallo upsert numérico', res.error.message);
    }
  } catch (e) {
    console.warn('[avatar] excepción en upsert avatar', (e as Error).message);
    // silencioso; UI ya refleja el cambio local
  } finally {
    window.__net?.end?.();
  }
}

export async function updatePlayerProfile(
  authUid: string,
  data: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  },
): Promise<void> {
  // Update local storage copy if a local player with same id exists
  const current = readFromLocalStorage();
  const idx = current.findIndex((p) => p.id === authUid);
  if (idx >= 0) {
    current[idx] = {
      ...current[idx],
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
    } as Player;
    writeToLocalStorage(current);
  }

  if (!supabase) return;
  // Intentamos escribir siempre; políticas RLS deben permitir update/upsert público controlado.
  // Si la política requiere sesión y no la hay, simplemente fallará y capturamos.

  let lastError: Error | null = null;
  const payload: {
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  } = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.avatarUrl !== undefined) {
    payload.avatar_url = data.avatarUrl;
  }

  if (Object.keys(payload).length === 0) return;

  // Evitamos PATCH (update) por problemas CORS -> usamos sólo UPSERT (POST)
  const upsertPayload = isNumericId(authUid)
    ? { id: authUid, slug: authUid, ...payload }
    : { slug: authUid, ...payload };
  const res = await supabase
    .from('players')
    .upsert(upsertPayload, { onConflict: 'slug' });
  if (!res.error) return;
  lastError = res.error;

  // all attempts failed
  const err = new Error(lastError?.message ?? 'Failed to update profile');
  throw err;
}

export function sortPlayers(players: Player[]): Player[] {
  return players.sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.experience !== a.experience) return b.experience - a.experience;
    return a.name.localeCompare(b.name);
  });
}

export function sortPlayersForLadder(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.experience !== a.experience) return b.experience - a.experience;
    return a.name.localeCompare(b.name);
  });
}

export function getTopPlayers(players: Player[], n: number): Player[] {
  const sorted = sortPlayers(players);
  return sorted.slice(0, n);
}
