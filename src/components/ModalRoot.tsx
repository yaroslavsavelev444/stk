'use client';

import { useCallbackModal } from '@/components/context/CallbackModalContext';
import { CallbackModal } from '@/components/callback-form/CallbackModal';

export function ModalRoot() {
  const { isOpen, close } = useCallbackModal();

  return <CallbackModal open={isOpen} onClose={close} />;
}