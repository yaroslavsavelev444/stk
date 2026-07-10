/**
 * Вычисляет список разрешённых origin'ов для CORS/CSRF и (опционально)
 * общий домен cookie аутентификации.
 *
 * Зачем это нужно: в production админка Payload открывается на отдельном
 * поддомене (admin.stkaktiv.ru), а публичный сайт и API — на stkaktiv.ru.
 * Браузер считает их разными origin'ами, поэтому:
 *   - Payload должен явно разрешить admin.* origin в cors/csrf, иначе
 *     запросы из админки к /api/* будут блокироваться браузером;
 *   - cookie сессии по умолчанию host-only (видна только на домене,
 *     который её выставил) — её нужно расширить на весь ".stkaktiv.ru",
 *     чтобы один и тот же логин работал и на sitedomain, и на admin-поддомене.
 *
 * В локальной разработке (без ADMIN_URL/COOKIE_DOMAIN) всё продолжает
 * работать как раньше: cookie остаётся host-only, а cors/csrf получают
 * единственный origin — NEXT_PUBLIC_SITE_URL (или localhost по умолчанию).
 */

const DEFAULT_SITE_URL = "http://localhost:3000";

function safeOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
const siteOrigin = safeOrigin(siteUrl) ?? DEFAULT_SITE_URL;
const siteHostname = (() => {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return "localhost";
  }
})();

const wwwOrigin =
  siteHostname === "localhost" ? null : `https://www.${siteHostname}`;

// ADMIN_URL — необязательная переменная окружения; если не задана, но
// известен обычный домен сайта (не localhost), по умолчанию используем
// https://admin.<hostname>.
const adminOrigin =
  safeOrigin(process.env.ADMIN_URL ?? "") ??
  (siteHostname !== "localhost" ? `https://admin.${siteHostname}` : null);

export const allowedOrigins: string[] = Array.from(
  new Set([siteOrigin, wwwOrigin, adminOrigin].filter((v): v is string => !!v)),
);

/**
 * Домен для auth-cookie. Задаётся явно через COOKIE_DOMAIN (например
 * ".stkaktiv.ru") только когда админка реально живёт на отдельном
 * поддомене. Если переменная не задана — возвращаем undefined, и Payload
 * использует поведение по умолчанию (host-only cookie), как и раньше.
 */
export const cookieDomain: string | undefined =
  process.env.COOKIE_DOMAIN || undefined;
