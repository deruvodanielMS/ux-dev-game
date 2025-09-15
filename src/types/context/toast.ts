// Toast context types
export type ToastLevel = 'info' | 'warning' | 'danger' | 'success';

export type Toast = {
  id: string;
  title?: string;
  message: string;
  level?: ToastLevel;
  duration?: number;
};

export type ToastContextType = {
  notify: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
};
