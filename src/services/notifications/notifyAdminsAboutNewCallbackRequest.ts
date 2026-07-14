import type { CallbackRequest } from "@/payload-types";
import {
  emailService,
  getAdminEmailAddresses,
  newCallbackRequestEmailTemplate,
} from "@/services/email";
import { emailLogger } from "../email/logger";

const ADMIN_PANEL_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

/**
 * Сценарий "уведомить администраторов о новой заявке". Живёт отдельно от
 * EmailService/шаблонов: собирает получателей и данные для шаблона, вызывает
 * emailService.send(). Каждый новый сценарий уведомления оформляется точно
 * так же — отдельной функцией в этой папке — без изменений в email-модуле.
 *
 * Ошибка отправки намеренно НЕ пробрасывается наверх: заявка на этот момент
 * уже сохранена в БД, и сбой уведомления не должен приводить к ошибке
 * пользовательского сценария (форма на сайте должна показать успех).
 */
export async function notifyAdminsAboutNewCallbackRequest(
  callbackRequest: CallbackRequest,
): Promise<void> {
  try {
    const admins = await getAdminEmailAddresses();

    if (admins.length === 0) {
      emailLogger.warn(
        "Уведомление о новой заявке не отправлено: нет администраторов с email",
        {
          callbackRequestId: callbackRequest.id,
        },
      );
      return;
    }

    await emailService.send(
      newCallbackRequestEmailTemplate,
      {
        id: callbackRequest.id,
        name: callbackRequest.name,
        phone: callbackRequest.phone,
        email: callbackRequest.email,
        comment: callbackRequest.comment,
        subject: callbackRequest.subject,
        productTitle: callbackRequest.productTitle,
        productSku: callbackRequest.productSku,
        createdAt: new Date(callbackRequest.createdAt),
        adminUrl: `${ADMIN_PANEL_BASE_URL}/admin/collections/callback-requests/${callbackRequest.id}`,
      },
      { to: admins },
    );
  } catch (error) {
    emailLogger.error("Не удалось уведомить администраторов о новой заявке", {
      callbackRequestId: callbackRequest.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
