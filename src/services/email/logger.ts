type LogContext = Record<string, unknown>;

/**
 * Тонкая обёртка над console со структурированным контекстом и единым
 * префиксом. Изолирована в отдельный модуль намеренно: чтобы в будущем
 * подменить реализацию на pino (уже используется транзитивно в проекте
 * Payload'ом) без изменений в остальном email-модуле.
 */
function buildPayload(level: string, message: string, context?: LogContext) {
  return {
    scope: "email",
    level,
    message,
    ...context,
    timestamp: new Date().toISOString(),
  };
}

export const emailLogger = {
  info(message: string, context?: LogContext) {
    console.log("[Email]", buildPayload("info", message, context));
  },
  warn(message: string, context?: LogContext) {
    console.warn("[Email]", buildPayload("warn", message, context));
  },
  error(message: string, context?: LogContext) {
    console.error("[Email]", buildPayload("error", message, context));
  },
};
