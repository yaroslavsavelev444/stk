'use client'

import React, { useCallback } from 'react'
import type { Product } from '@/payload-types'
import { useCallbackModal } from '@/components/context/CallbackModalContext'

type ProductActionsProps = {
  product: Product
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { open } = useCallbackModal()

  const handleRequestConsultation = useCallback(() => {
    open({
      subject: `Консультация по товару: ${product.name}`,
      productTitle: product.name,
      productSlug: product.slug,
      productSku:  product.slug,
      modalTitle: 'Консультация по товару',
      modalDescription: 'Оставьте заявку, и мы подробно расскажем о товаре.',
      customMessage: `Хочу получить консультацию по товару: ${product.name}`,
    })
  }, [open, product])

  const handleRequestQuote = useCallback(() => {
    open({
      subject: `Коммерческое предложение на ${product.name}`,
      productTitle: product.name,
      productSlug: product.slug,
      productSku:  product.slug,
      modalTitle: 'Запрос коммерческого предложения',
      modalDescription: 'Мы подготовим для вас индивидуальное КП.',
      customMessage: 'Прошу выслать коммерческое предложение.',
    })
  }, [open, product])

  return (
    <div className="product-actions" aria-label="Действия с товаром">
      <div className="product-actions__buttons">
        <button
          type="button"
          className="product-actions__btn product-actions__btn--primary"
          onClick={handleRequestConsultation}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M3 3h12a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V4a1 1 0 011-1z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Получить консультацию
        </button>

        <button
          type="button"
          className="product-actions__btn product-actions__btn--secondary"
          onClick={handleRequestQuote}
        >
          Запросить КП
        </button>
      </div>

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
      `}</style>
    </div>
  )
}