import supabase from './supabase';

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (!supabase) throw new Error('Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');

  const fileExt = file.name.split('.').pop() ?? 'png';
  const timestamp = Date.now();
  const fileName = `${userId}-${timestamp}.${fileExt}`; // unique filename to avoid caching collisions
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // Return the storage path (not the public URL). Caller should resolve URL for display.
  return filePath;
}

export async function uploadCharacterAvatar(file: File, characterId: string): Promise<string> {
  if (!supabase) throw new Error('Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');

  const fileExt = file.name.split('.').pop() ?? 'png';
  const fileName = `${characterId}.${fileExt}`;
  const attempts: { path: string; label: string }[] = [];

  // primary path: characters/<characterId>/<file>
  attempts.push({ path: `characters/${characterId}/${fileName}`, label: 'characters folder' });

  // fallback: upload under current user's folder (if storage policies restrict to auth.uid folders)
  try {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data?.user?.id ?? null;
    if (userId) attempts.push({ path: `${userId}/${fileName}`, label: 'user folder' });
    // also try user/characters/<id>
    if (userId) attempts.push({ path: `${userId}/characters/${characterId}.${fileExt}`, label: 'user characters folder' });
  } catch (e) {
    // ignore - we'll just try primary
  }

  let lastError: any = null;
  for (const attempt of attempts) {
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(attempt.path, file, {
          cacheControl: '3600',
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(attempt.path);
      if (!publicUrlData) throw new Error('Could not get public URL for character avatar');
      return publicUrlData.publicUrl;
    } catch (err: any) {
      lastError = err;
      console.warn(`Upload to ${attempt.label} failed:`, err?.message || err);
      // try next
    }
  }

  // all attempts failed
  const message = lastError?.message ?? 'Upload failed for unknown reason';
  const err = new Error(`Failed uploading character avatar: ${message}`);
  (err as any).original = lastError;
  throw err;
}

// Resolve a path or public URL to an accessible URL. If the provided value looks like a storage path
// (no protocol) try to create a signed URL. If it's already a http(s) URL, return as-is.
export async function resolveAvatarUrl(value: string | undefined | null): Promise<string | undefined> {
  if (!value) return undefined;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;

  if (!supabase) return undefined;

  // treat value as path inside the avatars bucket
  try {
    const path = value.startsWith('/') ? value.slice(1) : value;
    const { data } = await supabase.storage.from('avatars').createSignedUrl(path, 60 * 60);
    if (data?.signedUrl) return data.signedUrl;
  } catch (err) {
    console.warn('Failed to create signed url for avatar path', err);
  }

  return undefined;
}
