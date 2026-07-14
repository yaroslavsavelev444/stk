import { z } from "zod";
import { EmailConfigError } from "./errors";

const booleanFromEnv = (defaultValue: boolean) =>
  z
    .string()
    .optional()
    .transform((value) =>
      value === undefined ? defaultValue : value === "true",
    );

const enabledEnvSchema = z.object({
  EMAIL_ENABLED: booleanFromEnv(true),
});

const smtpEnvSchema = z.object({
  SMTP_HOST: z.string().min(1, "SMTP_HOST обязателен"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: booleanFromEnv(false),
  SMTP_USER: z.string().min(1, "SMTP_USER обязателен"),
  SMTP_PASSWORD: z.string().min(1, "SMTP_PASSWORD обязателен"),
  EMAIL_FROM_ADDRESS: z
    .string()
    .email("EMAIL_FROM_ADDRESS должен быть валидным email"),
  EMAIL_FROM_NAME: z.string().default("СТК-Актив"),
  EMAIL_MAX_RETRIES: z.coerce.number().int().min(0).max(10).default(3),
  EMAIL_RETRY_DELAY_MS: z.coerce.number().int().min(0).default(1000),
});

interface EmailConfigDisabled {
  enabled: false;
}

interface EmailConfigEnabled {
  enabled: true;
  SMTP_HOST: string;
  SMTP_PORT: number;
  smtpSecure: boolean;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM_ADDRESS: string;
  EMAIL_FROM_NAME: string;
  EMAIL_MAX_RETRIES: number;
  EMAIL_RETRY_DELAY_MS: number;
}

export type EmailConfig = EmailConfigDisabled | EmailConfigEnabled;

let cachedConfig: EmailConfig | null = null;

/**
 * Ленивая (вызывается при первом send(), а не при импорте модуля) валидация
 * конфигурации email-подсистемы. Кэшируется на весь процесс — переменные
 * окружения не меняются в рантайме.
 *
 * EMAIL_ENABLED проверяется первым и независимо от остальных полей: при
 * EMAIL_ENABLED=false SMTP_* не валидируются вообще (модуль отключён —
 * их может не быть, например, в dev/CI), а при true — namespace SMTP_*
 * обязателен и бросает понятную ошибку сразу, а не тихо теряет письма.
 */
export function getEmailConfig(): EmailConfig {
  if (cachedConfig) return cachedConfig;

  const enabledParsed = enabledEnvSchema.safeParse(process.env);
  const enabled = enabledParsed.success
    ? enabledParsed.data.EMAIL_ENABLED
    : true;

  if (!enabled) {
    cachedConfig = { enabled: false };
    return cachedConfig;
  }

  const parsed = smtpEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new EmailConfigError(
      `Некорректная конфигурация email-модуля: ${issues}`,
    );
  }

  cachedConfig = {
    enabled: true,
    SMTP_HOST: parsed.data.SMTP_HOST,
    SMTP_PORT: parsed.data.SMTP_PORT,
    smtpSecure: parsed.data.SMTP_SECURE,
    SMTP_USER: parsed.data.SMTP_USER,
    SMTP_PASSWORD: parsed.data.SMTP_PASSWORD,
    EMAIL_FROM_ADDRESS: parsed.data.EMAIL_FROM_ADDRESS,
    EMAIL_FROM_NAME: parsed.data.EMAIL_FROM_NAME,
    EMAIL_MAX_RETRIES: parsed.data.EMAIL_MAX_RETRIES,
    EMAIL_RETRY_DELAY_MS: parsed.data.EMAIL_RETRY_DELAY_MS,
  };

  return cachedConfig;
}

/** Только для тестов — сбрасывает кэш конфигурации между тест-кейсами. */
export function __resetEmailConfigCacheForTests(): void {
  cachedConfig = null;
}
