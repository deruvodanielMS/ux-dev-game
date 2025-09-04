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
