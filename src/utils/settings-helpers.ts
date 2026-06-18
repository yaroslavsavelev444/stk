import type { Setting } from '@/payload-types';

/**
 * Получить первый телефон из массива контактов
 */
export function getPrimaryPhone(settings: Setting | null): string | null {
  if (!settings) return null;
  const contact = settings.contacts?.find(c => c.type === 'phone');
  return contact?.value || null;
}

/**
 * Получить первый email из массива контактов
 */
export function getPrimaryEmail(settings: Setting | null): string | null {
  if (!settings) return null;
  const contact = settings.contacts?.find(c => c.type === 'email');
  return contact?.value || null;
}

/**
 * Получить название компании
 */
export function getCompanyName(settings: Setting | null): string | null {
  return settings?.companyName || null;
}

/**
 * Получить URL логотипа (если есть media)
 */
export function getLogoUrl(settings: Setting | null): string | null {
  if (!settings?.logo || typeof settings.logo === 'string') return null;
  // Если logo — это объект Media, то берём url
  const logo = settings.logo as any;
  return logo?.url || null;
}