import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../components/organisms/Toast/Toast.module.css';

export type ToastLevel = 'info' | 'warning' | 'danger' | 'success';
export type Toast = { id: string; title?: string; message: string; level?: ToastLevel; duration?: number };

type ToastContextType = {
  notify: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const notify = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `t-${Date.now()}-${counter.current++}`;
    const toast: Toast = { id, level: 'info', duration: 4500, ...t };
    setToasts((s) => [...s, toast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    toasts.forEach((t) => {
      if (!t.duration || t.duration <= 0) return;
      const timer = window.setTimeout(() => dismiss(t.id), t.duration);
      timers.push(timer);
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [toasts, dismiss]);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic className={styles.toastRoot}>
        {toasts.map((t) => (
          <div className={`${styles.toast} ${styles[t.level ?? 'info']}`} key={t.id} onClick={() => dismiss(t.id)}>
            {t.title && <div className={styles.toastTitle}>{t.title}</div>}
            <div className={styles.toastMessage}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(){
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
