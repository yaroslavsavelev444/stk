"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import { useCallbackModal } from "@/components/context/CallbackModalContext";
import { CallbackForm } from "./CallbackForm";

export function CallbackModal() {
  const { isOpen, contextData, close } = useCallbackModal();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return createPortal(
    <RemoveScroll>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="presentation"
      >
        <div
          className="absolute inset-0 bg-[var(--overlay)]"
          onClick={close}
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
            onClick={close}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full
              text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
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

          <CallbackForm
            variant="panel"
            onSuccess={close}
            initialData={contextData || undefined}
            title={contextData?.modalTitle || "Заказать звонок"}
            description={
              contextData?.modalDescription ||
              "Заполните форму — перезвоним и ответим на все вопросы."
            }
          />
        </div>
      </div>
    </RemoveScroll>,
    document.body,
  );
}
