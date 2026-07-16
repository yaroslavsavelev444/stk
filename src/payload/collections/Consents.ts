// src/payload/collections/Consents.ts
import type { CollectionConfig } from "payload";
import { generateSlug } from "../../utils/generateSlug.ts";
import { isAdminOrManager } from "../access/isAdminOrManager.ts";
import { seoField } from "../fields/seo.ts";
import { revalidateConsentsAfterChange, revalidateConsentsAfterDelete } from "../hooks/revalidateConsents.ts";

export const Consents: CollectionConfig = {
  slug: "consents",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "isPublished", "updatedAt"],
  },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  hooks: {
    afterChange: [revalidateConsentsAfterChange],
    afterDelete: [revalidateConsentsAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Название" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      hooks: { beforeValidate: [generateSlug] },
      admin: { description: "Автоматически генерируется из названия" },
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Краткое описание",
      admin: {
        description: "Показывается в списке на странице /consents",
        rows: 3,
      },
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      label: "Текст соглашения",
      admin: {
        description: "Полный текст. Разделяйте абзацы пустой строкой.",
        rows: 24,
      },
    },
    {
      name: "documentUrl",
      type: "text",
      label: "Ссылка на файл соглашения",
      admin: {
        description:
          "Внешняя ссылка на документ (например, на Яндекс.Диск). Файл не хранится в проекте — используется только URL, указанный здесь.",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            return "Ссылка должна начинаться с http:// или https://";
          }
          return true;
        } catch {
          return "Укажите корректную ссылку на документ";
        }
      },
    },
    {
      name: "documentLabel",
      type: "text",
      label: "Текст кнопки скачивания",
      admin: {
        description: "Например: «Скачать PDF». Необязательно.",
        condition: (data) => Boolean(data?.documentUrl),
      },
    },
    { name: "order", type: "number", defaultValue: 0 },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      label: "Опубликовано",
    },
    seoField,
  ],
};
