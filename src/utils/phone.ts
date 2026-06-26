import { parsePhoneNumberFromString, type PhoneNumber } from 'libphonenumber-js';

/**
 * Проверяет, является ли номер валидным российским номером.
 */
export function isValidRussianPhone(phone: string): boolean {
  if (!phone.trim()) return false;
  const parsed = parsePhoneNumberFromString(phone, 'RU');
  return parsed?.isValid() ?? false;
}

/**
 * Приводит номер к формату E.164 (+79991234567).
 * Если номер невалиден, выбрасывает ошибку.
 */
export function normalizePhoneToE164(phone: string): string {
  const parsed = parsePhoneNumberFromString(phone, 'RU');
  if (!parsed?.isValid()) {
    throw new Error('Invalid phone number');
  }
  return parsed.number; // всегда начинается с '+'
}

/**
 * Возвращает отформатированный номер для отображения (опционально).
 */
export function formatPhoneForDisplay(phone: string): string {
  const parsed = parsePhoneNumberFromString(phone, 'RU');
  return parsed?.formatInternational() ?? phone;
}