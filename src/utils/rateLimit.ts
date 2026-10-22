/**
 * Простой in-memory лимитер «не больше N событий за окно» по ключу (IP).
 * Приложение работает одним процессом в одном контейнере (см.
 * docker-compose.prod.yml), поэтому общего хранилища вроде Redis не нужно;
 * после рестарта счётчики обнуляются — для защиты формы от спама этого
 * достаточно.
 */
export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const hits = new Map<string, number[]>();

  return function isAllowed(key: string, now = Date.now()): boolean {
    const windowStart = now - windowMs;
    const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

    // Чистим протухшие ключи, чтобы Map не рос бесконечно
    if (hits.size > 10_000) {
      for (const [k, times] of hits) {
        if (times.every((t) => t <= windowStart)) hits.delete(k);
      }
    }

    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }

    recent.push(now);
    hits.set(key, recent);
    return true;
  };
}
