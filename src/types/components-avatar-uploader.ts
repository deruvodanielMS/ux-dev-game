// AvatarUploader component types
export interface AvatarUploaderProps {
  onFileSelected?: (file: File) => void; // selecciona, se sube al guardar
  onValidationError?: (message: string) => void;
  onError?: (error: unknown) => void;
  initialAvatar?: string | null;
  initialLevel?: number | null;
  maxSizeMB?: number; // límite de tamaño (default 2MB)
  acceptedTypes?: string[]; // MIME types (default ['image/png','image/jpeg','image/webp'])
}
