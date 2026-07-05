// src/payload/collections/MediaGalleries.ts
import type { CollectionConfig } from "payload";
import { isAdminOrManager } from "../access/isAdminOrManager.ts";

/**
 * Универсальная коллекция медиа-подборок для блоков сайта.
 *
 * Один документ = одна именованная подборка (сертификаты, отзывы,
 * партнёры, галерея производства и т.д.). Новый медиа-блок добавляется
 * созданием нового документа с уникальным `key` — без изменения схемы
 * и без новой коллекции/кода.
 *
 * `key` — стабильный программный идентификатор, по которому фронтенд
 * ищет подборку (см. services/payload/media-galleries.ts). Отображаемые
 * `title`/`description` можно менять свободно, `key` — нет.
 */
export const MediaGalleries: CollectionConfig = {
  slug: "media-galleries",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "key", "isPublished", "updatedAt"],
    description:
      "Универсальные медиа-подборки для блоков сайта (сертификаты, отзывы и т.д.)",
  },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      label: "Ключ блока (для разработчиков)",
      admin: {
        description:
          'Стабильный технический идентификатор, например "certificates" или "reviews". По нему блок ищется на фронтенде — после создания лучше не менять.',
      },
    },
    {
      name: "label",
      type: "text",
      required: true,
      label: "Название (для админки)",
    },
    { name: "title", type: "text", label: "Заголовок на сайте" },
    { name: "description", type: "textarea", label: "Описание на сайте" },
    {
      name: "items",
      type: "array",
      label: "Изображения",
      labels: { singular: "Изображение", plural: "Изображения" },
      admin: {
        description:
          "Порядок в списке = порядок отображения. Перетаскивайте для сортировки.",
        isSortable: true,
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Файл",
        },
        {
          name: "caption",
          type: "text",
          label: "Подпись / Alt-текст",
          admin: {
            description:
              "Необязательно. Если не указано — используется Alt файла.",
          },
        },
      ],
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      label: "Опубликовано",
    },
  ],
};
