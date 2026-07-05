import { getPayloadInstance } from "@/services/payload/getPayload";
import type { EmailAddress } from "../types";

/**
 * Возвращает email-адреса всех пользователей с ролью 'admin'. Инкапсулирует
 * запрос к Payload — сценарии уведомлений не должны знать о деталях схемы
 * коллекции `users` (поле роли, лимиты выборки и т.п.). При изменении схемы
 * ролей правится только этот файл.
 */
export async function getAdminEmailAddresses(): Promise<EmailAddress[]> {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "users",
    where: { role: { equals: "admin" } },
    limit: 200,
    depth: 0,
  });

  return result.docs
    .filter((user) => Boolean(user.email))
    .map((user) => ({ email: user.email }));
}
