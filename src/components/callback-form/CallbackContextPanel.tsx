"use client";

import { StatusPulse } from "./StatusPulse";

interface CallbackContextPanelProps {
  isSuccess: boolean;
}

/**
 * Левая колонка десктоп-версии: задаёт контекст и ожидание по времени,
 * чтобы форма не выглядела как голый набор инпутов.
 */
export function CallbackContextPanel({ isSuccess }: CallbackContextPanelProps) {
  return (
    <div className="flex h-full flex-col justify-between bg-[var(--primary)] p-8 text-[var(--text-inverse)] sm:p-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[13px] font-medium tracking-wide text-[var(--primary-200)]">
          <StatusPulse state={isSuccess ? "success" : "idle"} />
          {isSuccess ? "Заявка получена" : "Менеджеры на связи"}
        </div>

        <h3 className="text-[22px] font-semibold leading-snug sm:text-[26px]">
          Перезвоним в течение 15 минут
        </h3>

        <p className="text-[15px] leading-relaxed text-[var(--primary-200)]">
          Оставьте номер телефона — расскажем о наличии, подберём аналог и
          посчитаем стоимость с доставкой.
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
        <div>
          <dt className="text-[13px] text-[var(--primary-200)]">
            Среднее время ответа
          </dt>
          <dd className="mt-1 text-[18px] font-semibold">12 минут</dd>
        </div>
        <div>
          <dt className="text-[13px] text-[var(--primary-200)]">
            Режим работы
          </dt>
          <dd className="mt-1 text-[18px] font-semibold">8:00–17:00</dd>
        </div>
      </dl>
    </div>
  );
}
