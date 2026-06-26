'use client'

import React, { useState, useCallback } from 'react'
import type { Product } from '@/payload-types'

// TODO:
// Подключить CallbackModal из src/components/callback-form/CallbackModal.tsx
// Файл существует в проекте, но не был предоставлен для анализа.
// После анализа CallbackModal — интегрировать открытие модального окна
// с передачей контекста продукта (название, sku) через CallbackContextPanel.
// import { useCallbackModal } from '@components/hooks/useCallbackModal'
// import CallbackModal from '@components/callback-form/CallbackModal'

// TODO:
// Если используется MobX RootStore для управления состоянием модального окна,
// подключить через:
// import { useRootStore } from '@components/context/RootStoreContext'

type ProductActionsProps = {
  product: Product
}

type ActionState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Клиентский компонент действий на странице товара.
 *
 * Бизнес-логика:
 * - "Запросить консультацию" → открывает CallbackModal (TODO: подключить)
 * - "Отправить заявку" → отправляет через Payload callback service
 *
 * Medusa: addToCart, region, countryCode, variantId — удалены полностью.
 * Medusa: Button из @medusajs/ui — заменён на styled-button.
 * Medusa: OptionSelect, ProductPrice, MobileActions — удалены (нет variants).
 * Medusa: useIntersection / MobileActions sticky — удалены.
 *
 * Данные для формы: product.title, product.sku.
 */
export default function ProductActions({ product }: ProductActionsProps) {
  const [actionState, setActionState] = useState<ActionState>('idle')

  const handleRequestConsultation = useCallback(async () => {
    // TODO:
    // Открыть CallbackModal с предзаполненным контекстом:
    // {
    //   subject: `Консультация по товару: ${product.title}`,
    //   productSlug: product.slug,
    //   productSku: product.sku,
    // }
    // Сейчас используем inline-форму как временное решение.
    // После подключения CallbackModal — заменить эту логику.
    setActionState('loading')
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'consultation',
          productTitle: product.name,
          productSlug: product.slug,
          productSku: product.slug ?? null,
          message: `Запрос консультации по товару: ${product.name}`,
        }),
      })

      if (res.ok) {
        setActionState('success')
        // Сбросить через 4 секунды
        setTimeout(() => setActionState('idle'), 4000)
      } else {
        setActionState('error')
        setTimeout(() => setActionState('idle'), 3000)
      }
    } catch {
      setActionState('error')
      setTimeout(() => setActionState('idle'), 3000)
    }
  }, [product])

  const handleRequestQuote = useCallback(async () => {
    setActionState('loading')
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          productTitle: product.name,
          productSlug: product.slug,
          message: `Запрос коммерческого предложения: ${product.name}`,
        }),
      })

      if (res.ok) {
        setActionState('success')
        setTimeout(() => setActionState('idle'), 4000)
      } else {
        setActionState('error')
        setTimeout(() => setActionState('idle'), 3000)
      }
    } catch {
      setActionState('error')
      setTimeout(() => setActionState('idle'), 3000)
    }
  }, [product])

  const isLoading = actionState === 'loading'
  const isSuccess = actionState === 'success'
  const isError = actionState === 'error'

  return (
    <div className="product-actions" aria-label="Действия с товаром">
      {/* Статус-сообщение */}
      {isSuccess && (
        <div className="product-actions__status product-actions__status--success" role="alert">
          <span aria-hidden="true">✓</span> Заявка принята. Мы свяжемся с вами в ближайшее время.
        </div>
      )}
      {isError && (
        <div className="product-actions__status product-actions__status--error" role="alert">
          <span aria-hidden="true">!</span> Ошибка отправки. Позвоните нам напрямую.
        </div>
      )}

      {/* Основные CTA */}
      <div className="product-actions__buttons">
        {/* Главное действие */}
        <button
          type="button"
          className="product-actions__btn product-actions__btn--primary"
          onClick={handleRequestConsultation}
          disabled={isLoading}
          aria-busy={isLoading}
          aria-label={`Запросить консультацию по товару ${product.name}`}
        >
          {isLoading ? (
            <span className="product-actions__spinner" aria-hidden="true" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M3 3h12a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V4a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          )}
          Получить консультацию
        </button>

        {/* Вторичное действие */}
        <button
          type="button"
          className="product-actions__btn product-actions__btn--secondary"
          onClick={handleRequestQuote}
          disabled={isLoading}
          aria-busy={isLoading}
          aria-label={`Запросить коммерческое предложение по товару ${product.name}`}
        >
          {isLoading ? (
            <span className="product-actions__spinner product-actions__spinner--dark" aria-hidden="true" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M15 2H3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zM6 6h6M6 9h6M6 12h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
          Запросить КП
        </button>
      </div>

      {/* Дополнительная информация */}
      <div className="product-actions__meta">
        <div className="product-actions__meta-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3v4l3 1.5"
              stroke="var(--text-muted)"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
          <span>Ответим в течение 1 рабочего дня</span>
        </div>
        <div className="product-actions__meta-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2.5 2h3l1.5 3.5-1.5 1a8.5 8.5 0 004 4l1-1.5L14 10.5v3a1 1 0 01-1 1A12 12 0 012 3.5a1 1 0 01.5-.5z"
              stroke="var(--text-muted)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Или позвоните нам</span>
        </div>
      </div>

      <style>{`
        .product-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
        }

        .product-actions__status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 0.875rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.4;
        }

        .product-actions__status--success {
          background: var(--success-light);
          color: var(--success);
          border: 1px solid currentColor;
        }

        .product-actions__status--error {
          background: var(--danger-light);
          color: var(--danger);
          border: 1px solid currentColor;
        }

        .product-actions__buttons {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .product-actions__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
          line-height: 1;
        }

        .product-actions__btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .product-actions__btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .product-actions__btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .product-actions__btn--primary {
          background: var(--primary);
          color: var(--text-inverse);
        }

        .product-actions__btn--primary:hover:not(:disabled) {
          background: var(--primary-hover);
          box-shadow: 0 4px 16px rgba(46, 45, 143, 0.25);
        }

        .product-actions__btn--secondary {
          background: transparent;
          color: var(--primary);
          border: 1.5px solid var(--primary);
        }

        .product-actions__btn--secondary:hover:not(:disabled) {
          background: var(--primary-light);
        }

        .product-actions__meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 0.25rem;
          border-top: 1px solid var(--border-light);
        }

        .product-actions__meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        /* Spinner */
        .product-actions__spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: product-actions-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .product-actions__spinner--dark {
          border-color: rgba(46,45,143,0.25);
          border-top-color: var(--primary);
        }

        @keyframes product-actions-spin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-actions__spinner {
            animation: none;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}