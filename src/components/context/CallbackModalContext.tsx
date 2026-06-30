'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CallbackContextData {
  productTitle?: string;
  productSlug?: string;
  productSku?: string;
  subject?: string;
  customMessage?: string;
  modalTitle?: string;
  modalDescription?: string;
}

interface CallbackModalContextValue {
  isOpen: boolean;
  contextData: CallbackContextData | null;
  open: (data?: CallbackContextData) => void;
  close: () => void;
}

const CallbackModalContext = createContext<CallbackModalContextValue | null>(null);

export const CallbackModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contextData, setContextData] = useState<CallbackContextData | null>(null);

  const open = (data?: CallbackContextData) => {
    setContextData(data || null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // опционально: сбросить данные после закрытия
    // setContextData(null);
  };

  return (
    <CallbackModalContext.Provider value={{ isOpen, contextData, open, close }}>
      {children}
    </CallbackModalContext.Provider>
  );
};

export const useCallbackModal = () => {
  const ctx = useContext(CallbackModalContext);
  if (!ctx) {
    throw new Error('useCallbackModal must be used within CallbackModalProvider');
  }
  return ctx;
};