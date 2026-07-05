/**
 * Базовая ошибка email-модуля. Позволяет отличать сбои почтовой подсистемы
 * от остальных ошибок приложения через `instanceof EmailError`.
 */
export class EmailError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "EmailError";
    if (options?.cause) this.cause = options.cause;
  }
}

/** Ошибка конфигурации (отсутствующие/невалидные переменные окружения). */
export class EmailConfigError extends EmailError {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigError";
  }
}

/** Ошибка на этапе доставки письма транспортом (SMTP), после всех попыток. */
export class EmailDeliveryError extends EmailError {
  constructor(
    message: string,
    public readonly attempts: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "EmailDeliveryError";
  }
}

/** Ошибка построения шаблона (например, отсутствуют обязательные данные). */
export class EmailTemplateError extends EmailError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "EmailTemplateError";
  }
}
