import { newCallbackRequestEmailTemplate } from "./new-callback-request.template";

/**
 * Единый реестр всех email-шаблонов проекта. Не обязателен для работы
 * EmailService (шаблон можно передать напрямую), но даёт единую точку
 * для интроспекции/тестирования всех писем, которые умеет отправлять
 * система, — полезно при росте числа сценариев.
 */
export const emailTemplates = {
  newCallbackRequest: newCallbackRequestEmailTemplate,
} as const;
