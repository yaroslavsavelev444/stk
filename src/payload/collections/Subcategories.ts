import type { CollectionConfig } from "payload";
import { isAdminOrManager } from "../access/isAdminOrManager.ts";
import {
  revalidateSubcategoriesAfterChange,
  revalidateSubcategoriesAfterDelete,
} from "../hooks/revalidateSubcategories.ts";

/**
 * Подкатегории товаров (например, "Запрещающие" внутри категории "Дорожные
 * знаки"). Отдельная коллекция, а не свободный текст на товаре — так
 * админ выбирает подкатегорию из уже существующего списка, а не вводит её
 * заново на каждой карточке товара, что раньше приводило к дублям из-за
 * опечаток ("Запрещающие" vs "Запрещающиее"). Каждая подкатегория привязана
 * к одной категории верхнего уровня, поэтому список для выбора на товаре
 * фильтруется по уже выбранной категории (см. Products.subcategory).
 */
export const Subcategories: CollectionConfig = {
  slug: "subcategories",
  labels: { singular: "Подкатегория", plural: "Подкатегории" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "order", "isPublished"],
  },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  hooks: {
    afterChange: [revalidateSubcategoriesAfterChange],
    afterDelete: [revalidateSubcategoriesAfterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true, label: "Название" },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      label: "Категория",
      admin: {
        description:
          "Товары этой подкатегории будут доступны только внутри выбранной категории.",
      },
    },
    {
      name: "order",
      type: "number",
      required: false,
      label: "Порядок отображения",
      admin: {
        description:
          "Необязательно. Чем меньше число — тем выше подкатегория. Если не указано, используется обычный порядок.",
      },
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: true,
      label: "Опубликовано",
    },
  ],
};
