'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitCallbackRequest } from './actions'
import { CallbackField } from './CallbackField'
import { CallbackSuccessState } from './CallbackSuccessState'
import type { CallbackActionResult } from '@/types/callback-form'
import {PhoneInput} from './PhoneInput'
const initialState: CallbackActionResult = { ok: false }

interface CallbackFormProps {
  /** Заголовок над формой. По умолчанию скрыт в variant="compact" внутри модалки, где заголовок задаёт обёртка. */
  title?: string
  description?: string
  /** "panel" — форма с заголовком, как самостоятельный блок. "bare" — без заголовка, для использования внутри модалки/кастомной обёртки. */
  variant?: 'panel' | 'bare'
  onSuccess?: () => void
  className?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)]
        px-5 py-3 text-[15px] font-semibold text-[var(--text-inverse)] transition-colors duration-150
        hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]
        disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
            />
          </svg>
          Отправляем
        </>
      ) : (
        'Отправить заявку'
      )}
    </button>
  )
}

export function CallbackForm({
  title = 'Заказать звонок',
  description = 'Заполните форму — перезвоним и ответим на все вопросы.',
  variant = 'panel',
  onSuccess,
  className,
}: CallbackFormProps) {
  const [state, formAction] = useActionState(submitCallbackRequest, initialState)
  const [isSuccess, setIsSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) {
      setIsSuccess(true)
      formRef.current?.reset()
      onSuccess?.()
    }
  }, [state, onSuccess])

  if (isSuccess) {
    return (
      <div className={className}>
        <CallbackSuccessState onReset={() => setIsSuccess(false)} />
      </div>
    )
  }

  return (
    <div className={className}>
      {variant === 'panel' && (
        <div className="mb-6 flex flex-col gap-1.5">
          <h3 className="text-[20px] font-semibold text-[var(--text-primary)]">{title}</h3>
          <p className="text-[15px] text-[var(--text-secondary)]">{description}</p>
        </div>
      )}

      <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-4">
        {/* Honeypot: визуально и для скринридеров скрыт, реальные пользователи не заполнят */}
        <input
          type="text"
          name="company_site"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <CallbackField
          label="Ваше имя"
          name="name"
          placeholder="Иван"
          autoComplete="name"
          error={state.errors?.name}
        />

       
        {/* Заменяем обычное поле на PhoneInput */}
        <PhoneInput
          name="phone"
          label="Телефон"
          required
          error={state.errors?.phone}   // серверная ошибка, если не прошла валидация
        />

        <CallbackField
          label="Email"
          name="email"
          type="email"
          placeholder="mail@example.com"
          autoComplete="email"
          error={state.errors?.email}
        />

        <CallbackField
          as="textarea"
          label="Комментарий"
          name="comment"
          placeholder="Расскажите, что вас интересует"
          error={state.errors?.comment}
        />

        {state.message && !state.ok && (
          <p
            role="alert"
            className="rounded-[var(--radius-sm)] bg-[var(--danger-light)] px-3.5 py-2.5 text-[14px] text-[var(--danger)]"
          >
            {state.message}
          </p>
        )}

        <SubmitButton />

        <p className="text-center text-[13px] leading-relaxed text-[var(--text-muted)]">
          Нажимая «Отправить заявку», вы соглашаетесь на обработку
          персональных данных.
        </p>
      </form>
    </div>
  )
}
