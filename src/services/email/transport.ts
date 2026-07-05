import nodemailer, { type Transporter } from "nodemailer";
import { getEmailConfig } from "./config";

let cachedTransporter: Transporter | null = null;

/**
 * Singleton-транспорт nodemailer поверх SMTP. Пересоздаётся один раз на
 * процесс — так пул TCP/TLS-соединений nodemailer переиспользуется между
 * запросами, а не создаётся заново на каждое письмо.
 */
export function getEmailTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const config = getEmailConfig();

  cachedTransporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.smtpSecure,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASSWORD,
    },
  });

  return cachedTransporter;
}

/** Только для тестов. */
export function __resetEmailTransporterCacheForTests(): void {
  cachedTransporter = null;
}
