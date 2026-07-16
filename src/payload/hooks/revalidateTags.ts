/**
 * { expire: 0 } — немедленная инвалидация: админ должен увидеть изменения
 * сразу после сохранения, а не при следующем обновлении (stale-while-revalidate).
 *
 * "next/cache" — динамический импорт, а не статический: он резолвится
 * только внутри Next.js-рантайма (сборки/дев-сервера). Хуки Payload могут
 * выполняться и вне его — например, из скрипта миграции/сида
 * (scripts/seed-content.ts), запущенного через Payload Local API напрямую.
 * В таком окружении инвалидировать нечего (кэша ещё нет), поэтому ошибку
 * молча игнорируем, чтобы не ронять саму операцию записи.
 */
export async function revalidateTags(tags: Iterable<string>) {
  let revalidateTag: (tag: string, profile: string | { expire?: number }) => undefined;
  try {
    ({ revalidateTag } = await import("next/cache"));
  } catch {
    return;
  }

  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // no-op вне Next.js server-контекста
    }
  }
}
