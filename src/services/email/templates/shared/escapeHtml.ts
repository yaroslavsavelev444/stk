const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Экранирует пользовательский ввод перед вставкой в HTML письма.
 * Данные формы обратной связи (имя, комментарий) приходят от анонимных
 * посетителей сайта и не должны интерпретироваться как HTML/скрипты
 * в почтовом клиенте администратора.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}
