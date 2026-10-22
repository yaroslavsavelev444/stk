import type { CollectionConfig } from "payload";
import { CALLBACK_RETENTION_YEARS } from "../../resources/legal.ts";
import { authenticated } from "../access/authenticated.ts";
import { isAdmin } from "../access/isAdmin.ts";
import { notifyAdminsOnCallbackRequest } from "../hooks/notifyAdminsOnCallbackRequest.ts";

export const CallbackRequests: CollectionConfig = {
  slug: "callback-requests",
  admin: {
    useAsTitle: "phone",
    defaultColumns: ["phone", "name", "status", "createdAt"],
  },
  access: {
    read: authenticated,
    // Заявки с сайта создаёт только серверный экшен формы через Local API
    // (он обходит access-контроль). Публичный REST/GraphQL закрыт: иначе
    // заявку можно отправить в обход формы, валидации и согласия на ПД.
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [notifyAdminsOnCallbackRequest],
  },
  fields: [
    { name: "name", type: "text" },
    { name: "phone", type: "text", required: true },
    { name: "email", type: "email" },
    { name: "comment", type: "textarea" },
    {
      name: "subject",
      type: "text",
      label: "Тема обращения",
      admin: {
        description: "Контекст, из которого была отправлена заявка (например, раздел сайта)",
      },
    },
    {
      name: "productTitle",
      type: "text",
      label: "Название товара",
    },
    {
      name: "productSku",
      type: "text",
      label: "Артикул товара",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Новая", value: "new" },
        { label: "В обработке", value: "processing" },
        { label: "Завершена", value: "completed" },
      ],
      defaultValue: "new",
    },
    {
      // Доказательство согласия на обработку ПД (ч. 3 ст. 9 152-ФЗ)
      name: "consent",
      type: "group",
      label: "Согласие на обработку персональных данных",
      admin: { readOnly: true },
      fields: [
        { name: "acceptedAt", type: "date", label: "Дата и время согласия" },
        {
          name: "consentVersion",
          type: "text",
          label: "Редакция согласия",
          admin: { description: "slug документа и дата его последнего изменения" },
        },
        { name: "policyVersion", type: "text", label: "Редакция политики" },
      ],
    },
    {
      // По этой дате TTL-индекс MongoDB удаляет заявку
      // (scripts/create-search-indexes.ts). Пересчитывается при каждом
      // изменении — срок отсчитывается от последней работы с заявкой.
      name: "retainUntil",
      type: "date",
      label: "Хранится до",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: `Заявка удаляется автоматически через ${CALLBACK_RETENTION_YEARS} года после последнего изменения.`,
      },
      hooks: {
        beforeChange: [
          () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + CALLBACK_RETENTION_YEARS);
            return date.toISOString();
          },
        ],
      },
    },
  ],
};
