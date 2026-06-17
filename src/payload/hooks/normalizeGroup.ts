import type { FieldHook } from 'payload'

/**
 * Нормализует строку для группировки товаров:
 * - обрезает пробелы по краям;
 * - заменяет несколько пробелов внутри на один;
 * - приводит к нижнему регистру.
 */
export const normalizeGroup: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  if (trimmed === '') return undefined   // пустую строку превращаем в null/undefined (опциональное поле)

  const normalized = trimmed.replace(/\s+/g, ' ').toLowerCase()
  return normalized
}