// Modal context types
export type ModalActionButton = {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
};

export type ModalOptions = {
  title?: string;
  body?: React.ReactNode;
  actions?: ModalActionButton[];
  allowClose?: boolean;
};

export type ModalContextType = {
  showModal: (opts: ModalOptions) => void;
  hideModal: () => void;
};
