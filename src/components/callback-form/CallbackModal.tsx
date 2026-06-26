'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { RemoveScroll } from 'react-remove-scroll';
import { CallbackForm } from './CallbackForm';

interface CallbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function CallbackModal({ open, onClose }: CallbackModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Рендерим через портал в body
  return createPortal(
    <RemoveScroll>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="presentation"
      >
        <div
          className="absolute inset-0 bg-[var(--overlay)]"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="callback-modal-title"
          tabIndex={-1}
          className="relative w-full max-w-[440px] rounded-[var(--radius-lg)] bg-[var(--background)]
            p-6 shadow-[0_8px_30px_var(--shadow-color)] outline-none sm:p-8 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full
              text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h2 id="callback-modal-title" className="sr-only">
            Заказать звонок
          </h2>

          <CallbackForm variant="panel" onSuccess={() => undefined} />
        </div>
      </div>
    </RemoveScroll>,
    document.body
  );
}