"use client";

import React from "react";

export interface VariantOption {
  label: string;
  code: string;
  /** Доступна ли опция (есть валидная комбинация с ценой). */
  disabled?: boolean;
}

interface VariantOptionGroupProps {
  label: string;
  displayType: "dropdown" | "list";
  options: VariantOption[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
  /** Уникальный id для связи label ↔ группы (a11y). */
  groupId: string;
}

/**
 * Переиспользуемая группа выбора варианта. Тип отображения задаёт админ:
 *  - "list"     — сегментированные кнопки (radiogroup);
 *  - "dropdown" — выпадающий список (antd Select).
 * Никакой привязки к смыслу группы (цвет/размер/…): просто label + значения.
 */
export function VariantOptionGroup({
  label,
  displayType,
  options,
  selectedCode,
  onSelect,
  groupId,
}: VariantOptionGroupProps) {
  if (options.length === 0) return null;

  const selected = options.find((o) => o.code === selectedCode) ?? null;

  return (
    <div className="variant-group">
      <div className="variant-group__label" id={`${groupId}-label`}>
        {label}
      </div>

      {displayType === "dropdown" ? (
        // Нативный <select>: на мобильных даёт системный пикер (лучший touch-UX),
        // не зависит от рантайм-стилей UI-библиотеки, полностью доступен.
        <div className="variant-select-wrap">
          <select
            className="variant-select"
            value={selected?.code ?? ""}
            aria-labelledby={`${groupId}-label`}
            onChange={(e) => onSelect(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.code} value={o.code} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="variant-select__chevron"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div
          className="variant-group__list"
          role="radiogroup"
          aria-labelledby={`${groupId}-label`}
        >
          {options.map((o) => {
            const isActive = o.code === selectedCode;
            return (
              <button
                key={o.code}
                type="button"
                role="radio"
                aria-checked={isActive}
                disabled={o.disabled}
                className={`variant-chip${isActive ? " variant-chip--active" : ""}`}
                onClick={() => onSelect(o.code)}
              >
                <span>{o.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .variant-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .variant-group__label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: -0.01em;
        }
        .variant-group__list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .variant-chip {
          appearance: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          min-height: 40px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border);
          background: var(--background);
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1;
          transition:
            border-color 0.18s ease,
            background 0.18s ease,
            color 0.18s ease,
            box-shadow 0.18s ease,
            transform 0.12s ease;
        }
        .variant-chip:hover:not(:disabled) {
          border-color: var(--primary-200);
        }
        .variant-chip:active:not(:disabled) {
          transform: translateY(1px);
        }
        .variant-chip--active {
          border-color: var(--primary);
          background: var(--primary-light);
          color: var(--primary-700);
          box-shadow: 0 0 0 1px var(--primary) inset;
        }
        .variant-chip:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          text-decoration: line-through;
        }
        .variant-chip:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        /* Нативный select под тему проекта */
        .variant-select-wrap {
          position: relative;
          display: block;
        }
        .variant-select {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          min-height: 44px;
          padding: 0 2.5rem 0 0.875rem;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border);
          background: var(--background);
          color: var(--text-primary);
          font-size: 0.9375rem;
          font-weight: 500;
          line-height: 1.2;
          cursor: pointer;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }
        .variant-select:hover {
          border-color: var(--primary-200);
        }
        .variant-select:focus-visible {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-100);
        }
        .variant-select__chevron {
          position: absolute;
          right: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--text-muted);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
