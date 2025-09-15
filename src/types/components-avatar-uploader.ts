// AvatarUploader component types
export interface AvatarUploaderProps {
  userId?: string;
  onUploadSuccess?: (avatarUrl: string, storagePath?: string) => void;
  initialAvatar?: string | null;
  initialLevel?: number | null;
}
