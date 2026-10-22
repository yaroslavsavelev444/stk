import type { GlobalConfig } from "payload";
import { isAdmin } from "../access/isAdmin.ts";

/**
 * Настройки email-уведомлений. Отдельный global, а не поле в Settings:
 * Settings читается публично (read: () => true), а здесь хранятся ссылки
 * на учётные записи администраторов — их не должно быть в публичном API.
 */
export const NotificationSettings: GlobalConfig = {
  slug: "notification-settings",
  label: "Уведомления",
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: "callbackRecipients",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      label: "Кому приходят письма о новых заявках",
      filterOptions: { role: { equals: "admin" } },
      admin: {
        description:
          "Выберите администраторов, которым отправляется письмо о каждой новой заявке с сайта. Если никто не выбран, письмо получают все администраторы.",
      },
    },
  ],
};
