import React, { createContext, useContext, useMemo, useState } from 'react';

type ModalOptions = {
  title?: string;
  body?: React.ReactNode;
  actions?: { label: string; onClick?: () => void; variant?: 'primary' | 'ghost' }[];
  allowClose?: boolean;
};

type ModalContextType = {
  showModal: (opts: ModalOptions) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ModalOptions | null>(null);

  const showModal = (o: ModalOptions) => {
    setOpts(o);
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
    setTimeout(() => setOpts(null), 300);
  };

  const value = useMemo(() => ({ showModal, hideModal }), []);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {opts && (
        <div data-modal-root id="modal-root">
          <div className={`modal-backdrop ${open ? 'open' : ''}`} onClick={() => opts.allowClose !== false && hideModal()} />
          <div className={`modal-wrap ${open ? 'open' : ''}`} role="dialog" aria-modal>
            <div className="modal-card">
              {opts.title && <h3 className="modal-title">{opts.title}</h3>}
              <div className="modal-body">{opts.body}</div>
              <div className="modal-actions">
                {opts.actions?.map((a, i) => (
                  <button
                    key={i}
                    className={`modal-btn ${a.variant === 'ghost' ? 'ghost' : 'primary'}`}
                    onClick={() => {
                      a.onClick?.();
                      hideModal();
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        /* minimal scoped styles so we don't need extra files */
        .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);opacity:0;pointer-events:none;transition:opacity 220ms}
        .modal-backdrop.open{opacity:1;pointer-events:auto}
        .modal-wrap{position:fixed;left:0;right:0;top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;padding:1rem;z-index:1000;opacity:0;transition:opacity 220ms,transform 220ms}
        .modal-wrap.open{opacity:1;transform:translateY(-50%)}
        .modal-card{background:var(--card-bg,#111);border-radius:12px;padding:1rem;max-width:720px;width:100%;color:var(--text,#fff);box-shadow:0 6px 30px rgba(0,0,0,0.6)}
        .modal-title{margin:0 0 0.5rem 0}
        .modal-body{margin-bottom:0.75rem}
        .modal-actions{display:flex;gap:0.5rem;justify-content:flex-end}
        .modal-btn{padding:0.6rem 1rem;border-radius:8px;border:1px solid transparent;background:#1a73e8;color:white}
        .modal-btn.ghost{background:transparent;border-color:rgba(255,255,255,0.06);color:var(--muted,#9aa4b2)}

        /* bottom sheet on small screens */
        @media (max-width:600px){
          .modal-wrap{align-items:flex-end;top:auto;bottom:0;transform:none;padding:0}
          .modal-card{border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:12px;border-top-right-radius:12px;width:100%;padding:1rem}
        }
      `}</style>
    </ModalContext.Provider>
  );
}

export function useModal(){
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
