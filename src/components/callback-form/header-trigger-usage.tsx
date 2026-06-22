// src/components/header/CallbackButton.tsx
// Пример кнопки-триггера для вызова формы из хедера или любой другой страницы.

'use client'

import { CallbackModal, useCallbackModal } from '@/components/callback-form'

export function CallbackButton() {
  const { isOpen, open, close } = useCallbackModal()

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold
          text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)]"
      >
        Заказать звонок
      </button>

      <CallbackModal open={isOpen} onClose={close} />
    </>
  )
}
