import type { User } from "@/payload-types";
import { getPayloadInstance } from "@/services/payload/getPayload";
import type { EmailAddress } from "../types";

/**
 * Адреса администраторов, которым НЕ отправляются уведомления (в нижнем
 * регистре), когда получатели в global "Уведомления" не выбраны.
 * Пользователь остаётся админом в панели, но из рассылки исключён.
 */
const EXCLUDED_RECIPIENTS = new Set(["info@npo-polet.ru"]);

const isAdminWithEmail = (user: User) =>
  user.role === "admin" && Boolean(user.email);

const toAddresses = (users: User[]): EmailAddress[] =>
  users.map((user) => ({ email: user.email }));

/**
 * Возвращает адреса администраторов для уведомлений о заявках. Инкапсулирует
 * запросы к Payload — сценарии уведомлений не должны знать о деталях схемы
 * коллекции `users` и global `notification-settings`.
 *
 * Если в global "Уведомления" выбраны получатели — только они (и только
 * те, кто всё ещё админ). Если никто не выбран или выбранные удалены /
 * понижены до менеджера — все администраторы, чтобы заявки не терялись.
 */
export async function getAdminEmailAddresses(): Promise<EmailAddress[]> {
  const payload = await getPayloadInstance();

  const { callbackRecipients } = await payload.findGlobal({
    slug: "notification-settings",
    depth: 1,
  });

  const selected = (callbackRecipients ?? []).filter(
    (user): user is User => typeof user === "object" && user !== null,
  );
  const selectedAdmins = selected.filter(isAdminWithEmail);
  if (selectedAdmins.length > 0) {
    return toAddresses(selectedAdmins);
  }

  const result = await payload.find({
    collection: "users",
    where: { role: { equals: "admin" } },
    limit: 200,
    depth: 0,
  });

  return toAddresses(
    result.docs.filter(
      (user) =>
        isAdminWithEmail(user) &&
        !EXCLUDED_RECIPIENTS.has(user.email.trim().toLowerCase()),
    ),
  );
}
