import { supabase } from './supabase';

// Construye una URL pública a partir de un path relativo (bucket público 'avatars').
// Precedencia:
// 1. VITE_SUPABASE_AVATARS_BASE_URL (si se definió manualmente)
// 2. Derivar de VITE_SUPABASE_URL => <url>/storage/v1/object/public/avatars
// Si no existen, devuelve el path tal cual (probablemente romperá la img y sirve como indicador).
export function publicAvatarUrlFor(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // ya es URL completa
  const cleaned = path.startsWith('/') ? path.slice(1) : path;
  const explicitBase = import.meta.env.VITE_SUPABASE_AVATARS_BASE_URL as
    | string
    | undefined;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const base =
    explicitBase ||
    (supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/avatars`
      : undefined);
  if (base) return `${base}/${cleaned}`;

  // Fallback: intentar usar getPublicUrl del cliente (no requiere red y devuelve un placeholder aunque el bucket no sea público)
  try {
    const pub = supabase?.storage.from('avatars').getPublicUrl(cleaned)
      .data.publicUrl;
    if (pub) return pub;
  } catch {
    // ignorar
  }

  // Último recurso: devolver el path (romperá la imagen y sirve como indicador visual de que falta configuración)
  return cleaned;
}

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  if (!supabase)
    throw new Error(
      'Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    );

  // Sanitizar userId (Auth0 sub puede contener '|', ':', etc.) para usarlo como carpeta.
  const safeUserId = sanitizeStorageKey(userId);

  const fileExt = file.name.split('.').pop() ?? 'png';
  const timestamp = Date.now();
  const fileName = `${safeUserId}-${timestamp}.${fileExt}`; // unique filename to avoid caching collisions
  const filePath = `${safeUserId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });
  if (uploadError) {
    const msg = (uploadError as Error)?.message || '';
    if (msg.toLowerCase().includes('row-level security')) {
      throw new Error(
        'RLS storage policy bloqueó la subida. Crea una policy en storage.objects para permitir INSERT en el bucket "avatars" (o habilita auth de Supabase / endpoint server).',
      );
    }
    throw uploadError;
  }

  // Return the storage path (not the public URL). Caller should resolve URL for display.
  return filePath;
}

// Reemplaza caracteres no válidos en claves de almacenamiento.
// Permitimos alfanumérico, '-', '_', '/', y convertimos el resto a '-'.
// Además truncamos a 64 chars para evitar rutas excesivas.
function sanitizeStorageKey(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-');
  return cleaned.slice(0, 64) || 'user';
}

export async function uploadCharacterAvatar(
  file: File,
  characterId: string,
): Promise<string> {
  if (!supabase)
    throw new Error(
      'Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    );

  const fileExt = file.name.split('.').pop() ?? 'png';
  const timestamp = Date.now();
  const fileName = `${characterId}-${timestamp}.${fileExt}`;
  const attempts: { path: string; label: string }[] = [];

  // primary path: characters/<characterId>/<file>
  attempts.push({
    path: `characters/${characterId}/${fileName}`,
    label: 'characters folder',
  });

  // fallback: upload under current user's folder (if storage policies restrict to auth.uid folders)
  try {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data?.user?.id ?? null;
    if (userId)
      attempts.push({ path: `${userId}/${fileName}`, label: 'user folder' });
    // also try user/characters/<id>
    if (userId)
      attempts.push({
        path: `${userId}/characters/${characterId}-${timestamp}.${fileExt}`,
        label: 'user characters folder',
      });
  } catch {
    // ignore - we'll just try primary
  }

  let lastError: Error | null = null;
  for (const attempt of attempts) {
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(attempt.path, file, {
          cacheControl: '3600',
          upsert: true,
        });
      if (uploadError) throw uploadError;

      // return storage path so it's stored in DB and later resolved for display
      return attempt.path;
    } catch (err: unknown) {
      lastError = err as Error;
      console.warn(
        `Upload to ${attempt.label} failed:`,
        (err as Error)?.message || err,
      );
      // try next
    }
  }

  // all attempts failed
  const message = lastError?.message ?? 'Upload failed for unknown reason';
  throw new Error(`Failed uploading character avatar: ${message}`);
}

// Resolve a path or public URL to an accessible URL. If the provided value looks like a storage path
// (no protocol) try to create a signed URL. If it's already a http(s) URL, return as-is.
export async function resolveAvatarUrl(
  value: string | undefined | null,
): Promise<string | undefined> {
  if (!value) return undefined;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;

  if (!supabase) return undefined;

  // treat value as path inside the avatars bucket
  try {
    const path = value.startsWith('/') ? value.slice(1) : value;
    const { data } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, 60 * 60);
    if (data?.signedUrl) return data.signedUrl;
  } catch (err) {
    console.warn('Failed to create signed url for avatar path', err);
  }

  return undefined;
}
