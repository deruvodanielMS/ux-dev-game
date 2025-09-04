import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

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
      <div aria-live="polite" aria-atomic className="toast-root">
        {toasts.map((t) => (
          <div className={`toast ${t.level ?? 'info'}`} key={t.id} onClick={() => dismiss(t.id)}>
            {t.title && <div className="toast-title">{t.title}</div>}
            <div className="toast-message">{t.message}</div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .toast-root{position:fixed;right:1rem;bottom:1rem;display:flex;flex-direction:column;gap:0.5rem;z-index:1200}
        .toast{min-width:200px;max-width:360px;padding:0.6rem 0.75rem;border-radius:10px;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.45);cursor:pointer}
        .toast .toast-title{font-weight:800;margin-bottom:0.25rem}
        .toast.info{background:linear-gradient(90deg,#3b82f6,#60a5fa)}
        .toast.success{background:linear-gradient(90deg,#10b981,#34d399)}
        .toast.warning{background:linear-gradient(90deg,#f59e0b,#f97316)}
        .toast.danger{background:linear-gradient(90deg,#ef4444,#f97375)}

        @media (max-width:600px){
          .toast-root{left:50%;right:auto;transform:translateX(-50%);bottom:1rem}
          .toast{min-width:280px}
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast(){
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
