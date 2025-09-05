import React, { createContext, useContext, useMemo, useState } from 'react';
import styles from '../components/organisms/Modal/Modal.module.css';

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
          <div className={`${styles.modalBackdrop} ${open ? styles.open : ''}`} onClick={() => opts.allowClose !== false && hideModal()} />
          <div className={`${styles.modalWrap} ${open ? styles.open : ''}`} role="dialog" aria-modal>
            <div className={styles.modalCard}>
              <div className={styles.modalHeader}>
                {opts.title && <h3 className={styles.modalTitle}>{opts.title}</h3>}
                {opts.allowClose !== false && (
                  <button aria-label="Cerrar" className={styles.modalClose} onClick={hideModal}>&times;</button>
                )}
              </div>

              <div className={styles.modalBody}>{opts.body}</div>

              <div className={styles.modalActions}>
                {opts.actions?.map((a, i) => (
                  <button
                    key={i}
                    className={`${styles.modalBtn} ${a.variant === 'ghost' ? styles.ghost : ''}`}
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
    </ModalContext.Provider>
  );
}

export function useModal(){
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
