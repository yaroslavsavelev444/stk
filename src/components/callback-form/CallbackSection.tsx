'use client'

import { useState } from 'react'
import { CallbackContextPanel } from './CallbackContextPanel'
import { CallbackForm } from './CallbackForm'

interface CallbackSectionProps {
  className?: string
}

/**
 * Самостоятельный блок "Заказать звонок" для страниц вроде /contacts.
 * Десктоп: две колонки (контекст + форма). Мобайл: контекст сворачивается над формой.
 */
export function CallbackSection({ className }: CallbackSectionProps) {
  const [isSuccess, setIsSuccess] = useState(false)

  return (
    <section
      className={`overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)]
        shadow-[0_1px_2px_var(--shadow-color)] ${className ?? ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <CallbackContextPanel isSuccess={isSuccess} />

        <div className="p-6 sm:p-10">
          <CallbackForm
            variant="panel"
            onSuccess={() => setIsSuccess(true)}
          />
        </div>
      </div>
    </section>
  )
}
