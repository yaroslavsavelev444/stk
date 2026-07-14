import type { CollectionAfterChangeHook } from "payload";
import type { CallbackRequest } from "@/payload-types";
import { notifyAdminsAboutNewCallbackRequest } from "@/services/notifications/notifyAdminsAboutNewCallbackRequest";

/**
 * afterChange-хук коллекции CallbackRequests: при создании новой заявки
 * запускает уведомление администраторов. Срабатывает независимо от
 * источника создания документа.
 *
 * Вызов дожидается завершения (await), а не "fire-and-forget": иначе
 * промис уведомления мог бы не успеть завершиться до конца обработки
 * запроса. notifyAdminsAboutNewCallbackRequest никогда не бросает
 * исключение наружу (см. её реализацию) — поэтому здесь безопасно не
 * оборачивать вызов в try/catch: сбой отправки письма не должен ронять
 * сохранение документа.
 */
export const notifyAdminsOnCallbackRequest: CollectionAfterChangeHook<
  CallbackRequest
> = async ({ doc, operation }) => {
  if (operation === "create") {
    await notifyAdminsAboutNewCallbackRequest(doc);
  }

  return doc;
};
