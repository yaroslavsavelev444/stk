'use client';

import { useState, useCallback, useRef } from 'react';
import { IMaskInput } from 'react-imask';
import { isValidRussianPhone } from '@/utils/phone';

interface PhoneInputProps {
  name: string;
  label: string;
  required?: boolean;
  error?: string;          // ошибка с сервера
  serverError?: string;    // дополнительно можно передать
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  className?: string;
}

export function PhoneInput({
  name,
  label,
  required,
  error: serverError,
  onChange,
  onBlur,
  className,
}: PhoneInputProps) {
  const [value, setValue] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Очищаем клиентскую ошибку при изменении значения
  const handleInput = useCallback((rawValue: string) => {
    setValue(rawValue);
    setClientError(null); // сбрасываем ошибку при вводе
    onChange?.(rawValue);
  }, [onChange]);

  // Проверка на потерю фокуса
  const handleBlur = useCallback(() => {
    const trimmed = value.trim();
    if (required && !trimmed) {
      setClientError('Укажите телефон');
    } else if (trimmed && !isValidRussianPhone(trimmed)) {
      setClientError('Введите корректный номер телефона');
    } else {
      setClientError(null);
    }
    onBlur?.(value);
  }, [value, required, onBlur]);

  // Синхронизация с серверной ошибкой (если она пришла, перекрываем клиентскую)
  const displayedError = clientError || serverError || undefined;

  // Для a11y
  const fieldId = `callback-field-${name}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-[13px] font-medium tracking-wide text-[var(--text-secondary)]"
      >
        {label}
        {required && <span className="ml-0.5 text-[var(--accent)]">*</span>}
      </label>

      <IMaskInput
        id={fieldId}
        name={name}
        inputRef={inputRef}
        mask="+{7} (000) 000-00-00"
        placeholder="+7 (999) 000-00-00"
        value={value}
        onAccept={(rawValue) => handleInput(rawValue)}
        onBlur={handleBlur}
        className={[
          'w-full rounded-[var(--radius-sm)] border bg-[var(--background)] px-3.5 py-2.5 text-[15px]',
          'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
          'transition-colors duration-150 outline-none',
          'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]',
          displayedError
            ? 'border-[var(--danger)]'
            : 'border-[var(--border)] hover:border-[var(--text-muted)]',
          className ?? '',
        ].join(' ')}
        aria-invalid={Boolean(displayedError)}
        aria-describedby={displayedError ? `${fieldId}-error` : undefined}
        autoComplete="tel"
      />

      {displayedError && (
        <p id={`${fieldId}-error`} className="text-[13px] text-[var(--danger)]">
          {displayedError}
        </p>
      )}
    </div>
  );
}