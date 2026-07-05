"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

interface BaseFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

type FieldInputProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & { as?: "input" };

type FieldTextareaProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

type CallbackFieldProps = FieldInputProps | FieldTextareaProps;

/**
 * Единое поле формы: лейбл + инпут/textarea + слот под ошибку.
 * Стилизация полностью на токенах theme.css, без сторонних UI-китов —
 * так гарантированно попадаем в цветовую палитру сайта.
 */
export const CallbackField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CallbackFieldProps
>(function CallbackField(
  { label, name, error, required, hint, as = "input", className, ...rest },
  ref,
) {
  const fieldId = `callback-field-${name}`;
  const describedBy = error
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined;

  const sharedClassName = [
    "w-full rounded-[var(--radius-sm)] border bg-[var(--background)] px-3.5 py-2.5 text-[15px]",
    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
    "transition-colors duration-150 outline-none",
    "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]",
    error
      ? "border-[var(--danger)]"
      : "border-[var(--border)] hover:border-[var(--text-muted)]",
    className ?? "",
  ].join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-[13px] font-medium tracking-wide text-[var(--text-secondary)]"
      >
        {label}
        {required && <span className="ml-0.5 text-[var(--accent)]">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${sharedClassName} min-h-[96px] resize-y`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          ref={ref as React.Ref<HTMLInputElement>}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={sharedClassName}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error ? (
        <p id={`${fieldId}-error`} className="text-[13px] text-[var(--danger)]">
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${fieldId}-hint`}
          className="text-[13px] text-[var(--text-muted)]"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
});
