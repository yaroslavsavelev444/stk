import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import type { EmailAdapter } from "payload";
import { getEmailConfig } from "../../services/email/config.ts";
import { EmailConfigError } from "../../services/email/errors.ts";

/**
 * Конфигурация встроенной почты Payload (сброс пароля, верификация email
 * и т.д.) на тех же SMTP_*, что и кастомный EmailService в
 * src/services/email — чтобы не держать SMTP-настройки в двух местах.
 *
 * Вызывается один раз при построении payload.config.ts, до старта
 * сервера — поэтому ошибка конфигурации SMTP не должна валить весь сайт:
 * при EMAIL_ENABLED=false, а также при некорректном/неполном SMTP_*,
 * возвращаем undefined и логируем предупреждение. Payload в этом случае
 * сам подставляет тестовый ethereal-адаптер (как и раньше при полностью
 * пустой конфигурации) — встроенная почта Payload не работает, но сайт
 * продолжает работать.
 */
export function getPayloadEmailAdapter(): Promise<EmailAdapter> | undefined {
  let config: ReturnType<typeof getEmailConfig>;
  try {
    config = getEmailConfig();
  } catch (error) {
    if (error instanceof EmailConfigError) {
      console.warn(
        `[Payload email] Встроенная почта Payload отключена: ${error.message}`,
      );
      return undefined;
    }
    throw error;
  }

  if (!config.enabled) return undefined;

  return nodemailerAdapter({
    defaultFromAddress: config.EMAIL_FROM_ADDRESS,
    defaultFromName: config.EMAIL_FROM_NAME,
    transportOptions: {
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.smtpSecure,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    },
  });
}
