"use client";

import { useCallbackModal } from "@/components/context/CallbackModalContext";

export function CallbackButton() {
  const { open } = useCallbackModal();

  return (
    <button
      type="button"
      onClick={open}
      className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold
        text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)]"
    >
      Заказать звонок
    </button>
  );
}
