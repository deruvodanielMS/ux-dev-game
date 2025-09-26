import { publicAvatarUrlFor } from '@/services/avatars';

// Centraliza la lógica de resolución de la URL efectiva del avatar.
// Prioridad:
// 1. url explícita (avatarUrl)
// 2. path almacenado (avatarPath) -> convertir a URL pública
// 3. legacy field 'avatar' (si existe en algún objeto heredado)
// 4. fallback (authPicture) si se pasa explícitamente
export function resolvePlayerAvatar(opts: {
  avatarUrl?: string | null;
  avatarPath?: string | null;
  legacyAvatar?: string | null;
  authPicture?: string | null;
}): string | null {
  const { avatarUrl, avatarPath, legacyAvatar, authPicture } = opts;
  if (avatarUrl) return avatarUrl;
  if (avatarPath) {
    const url = publicAvatarUrlFor(avatarPath);
    if (url) return url;
  }
  if (legacyAvatar) {
    const url = publicAvatarUrlFor(legacyAvatar);
    if (url) return url;
  }
  return authPicture || null;
}
