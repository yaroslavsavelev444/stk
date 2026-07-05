export interface EmailAddress {
  email: string;
  name?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Контракт шаблона письма. `data` — строго типизированный набор входных
 * данных конкретного сценария, `render` — чистая функция без побочных
 * эффектов и без знания об SMTP/Payload. Это то, что позволяет добавлять
 * новые письма и тестировать их изолированно от реальной отправки.
 */
export interface EmailTemplate<TData> {
  /** Технический идентификатор шаблона — используется в логах. */
  id: string;
  render: (data: TData) => RenderedEmail;
}

export interface SendEmailOptions {
  to: EmailAddress | EmailAddress[];
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  attempts: number;
}
