import React, { createContext, useContext, useMemo, useState } from 'react';

import type { ModalContextType, ModalOptions } from '@/types/context/modal';

import { Button } from '@/components/atoms/Button/Button';
import { IconButton } from '@/components/atoms/Button/IconButton';
import styles from '@/components/organisms/Modal/Modal.module.css';

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
          <div
            className={`${styles.modalBackdrop} ${open ? styles.open : ''}`}
            onClick={() => opts.allowClose !== false && hideModal()}
            onKeyDown={(e) =>
              e.key === 'Escape' && opts.allowClose !== false && hideModal()
            }
            role="button"
            tabIndex={-1}
            aria-label="Close modal"
          />
          <div
            className={`${styles.modalWrap} ${open ? styles.open : ''}`}
            role="dialog"
            aria-modal
          >
            <div className={styles.modalCard}>
              <div className={styles.modalHeader}>
                {opts.title && (
                  <h3 className={styles.modalTitle}>{opts.title}</h3>
                )}
                {opts.allowClose !== false && (
                  <IconButton
                    ariaLabel="Cerrar"
                    icon={
                      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>
                        &times;
                      </span>
                    }
                    className={styles.modalClose}
                    onClick={hideModal}
                    variant="plain"
                    size="sm"
                    title="Cerrar"
                  />
                )}
              </div>

              <div className={styles.modalBody}>{opts.body}</div>

              <div className={styles.modalActions}>
                {opts.actions?.map((a, i) => (
                  <Button
                    key={i}
                    variant={a.variant === 'ghost' ? 'ghost' : 'primary'}
                    className={`${styles.modalBtn} ${a.variant === 'ghost' ? styles.ghost : ''}`}
                    onClick={() => {
                      a.onClick?.();
                      hideModal();
                    }}
                    ariaLabel={a.label}
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
