'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CallbackModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CallbackModalContext = createContext<CallbackModalContextValue | null>(null);

export const CallbackModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <CallbackModalContext.Provider value={{ isOpen, open, close }}>
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