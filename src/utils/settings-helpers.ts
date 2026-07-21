import type { Setting } from "@/payload-types";

/**
 * Получить первый телефон менеджера.
 * Если менеджеров нет — ищет телефон в общих контактах.
 */
export function getPrimaryPhone(settings: Setting | null): string | null {
  if (!settings) return null;

  const managerPhone = settings.managers?.find(
    (manager) => manager.phone,
  )?.phone;

  if (managerPhone) {
    return managerPhone;
  }

  const contactPhone = settings.contacts?.find(
    (contact) => contact.type === "phone",
  )?.value;

  return contactPhone || null;
}

/**
 * Получить первый email из массива контактов
 */
export function getPrimaryEmail(settings: Setting | null): string | null {
  if (!settings) return null;
  const contact = settings.contacts?.find((c) => c.type === "email");
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
  if (!settings?.logo || typeof settings.logo === "string") return null;
  // Если logo — это объект Media, то берём url
  const logo = settings.logo as any;
  return logo?.url || null;
}
