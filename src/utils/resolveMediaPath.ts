import type { Media } from "@/payload-types";

/**
 * Payload отдаёт `Media.url` абсолютным адресом (с хостом/портом окружения,
 * в котором был сохранён документ). next/image должен получать либо
 * относительный путь, либо домен, явно разрешённый в next.config.mjs
 * remotePatterns — поэтому оставляем только pathname (тот же приём, что и
 * в CategoryCard/resolveHeroMedia).
 */
export function resolveMediaPath(media?: (string | null) | Media): string | null {
  if (!media || typeof media === "string" || !media.url) return null;
  try {
    return new URL(media.url).pathname;
  } catch {
    return media.url;
  }
}
