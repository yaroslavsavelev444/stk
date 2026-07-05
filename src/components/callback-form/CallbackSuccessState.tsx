"use client";

interface CallbackSuccessStateProps {
  onReset?: () => void;
}

/**
 * Уведомление об успехе: текст по ТЗ — "менеджер перезвонит в свободное время".
 * Используем success-токены, а не accent, чтобы состояние явно читалось
 * как положительное завершение, а не как ещё один CTA.
 */
export function CallbackSuccessState({ onReset }: CallbackSuccessStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-light)]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke="var(--success)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Заявка отправлена
        </h3>
        <p className="max-w-[320px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Менеджер перезвонит вам в свободное время.
        </p>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-2 text-[14px] font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
        >
          Отправить ещё одну заявку
        </button>
      )}
    </div>
  );
}
