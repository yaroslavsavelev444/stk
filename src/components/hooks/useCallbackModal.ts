'use client'

import { useCallback, useState } from 'react'

/**
 * Простой хук открытия/закрытия модалки.
 * Используется кнопкой-триггером (например, в хедере) вместе с <CallbackModal />.
 *
 * Пример:
 *   const { isOpen, open, close } = useCallbackModal()
 *   <button onClick={open}>Заказать звонок</button>
 *   <CallbackModal open={isOpen} onClose={close} />
 */
export function useCallbackModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}
