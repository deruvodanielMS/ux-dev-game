import supabase from './supabase';

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (!supabase) throw new Error('Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');

  const fileExt = file.name.split('.').pop() ?? 'png';
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
  if (!publicUrlData) throw new Error('Could not get public URL');
  return publicUrlData.publicUrl;
}

export async function uploadCharacterAvatar(file: File, characterId: string): Promise<string> {
  if (!supabase) throw new Error('Supabase client not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');

  const fileExt = file.name.split('.').pop() ?? 'png';
  const fileName = `${characterId}.${fileExt}`;
  const filePath = `characters/${characterId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
  if (!publicUrlData) throw new Error('Could not get public URL for character avatar');
  return publicUrlData.publicUrl;
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
