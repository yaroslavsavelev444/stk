"use client";

import { useId } from "react";
import { CONSENT_DOCUMENT_SLUG, POLICY_DOCUMENT_SLUG } from "@/resources/legal";

interface ConsentCheckboxProps {
  name: string;
  error?: string;
  onChange?: () => void;
}

const linkClassName = "transition-colors hover:text-[var(--text-primary)]";

// Инлайн, а не класс underline: глобальный a:not(.button) из Once UI
// сильнее утилиты Tailwind, а ссылки на документы должны быть заметны
const linkStyle = { textDecoration: "underline", textUnderlineOffset: 2 };

/**
 * Отдельное согласие на обработку ПД: неотмеченный по умолчанию чекбокс,
 * без которого заявка не уходит (проверяется и здесь, и в серверном экшене).
 */
export function ConsentCheckbox({ name, error, onChange }: ConsentCheckboxProps) {
  // useId, а не id из name: на странице может быть две формы (секция и модалка)
  const fieldId = `callback-field-${name}-${useId()}`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2.5">
        <input
          id={fieldId}
          type="checkbox"
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          onChange={onChange}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--accent)]"
        />
        <label
          htmlFor={fieldId}
          className="cursor-pointer text-[13px] leading-relaxed text-[var(--text-secondary)]"
        >
          Даю{" "}
          <a
            href={`/consents/${CONSENT_DOCUMENT_SLUG}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            style={linkStyle}
          >
            согласие на обработку персональных данных
          </a>{" "}
          и подтверждаю, что ознакомлен(а) с{" "}
          <a
            href={`/consents/${POLICY_DOCUMENT_SLUG}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            style={linkStyle}
          >
            Политикой обработки персональных данных
          </a>
          <span className="ml-0.5 text-[var(--accent)]">*</span>
        </label>
      </div>

      {error && (
        <p id={`${fieldId}-error`} className="text-[13px] text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
