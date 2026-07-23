import type { GlobalConfig } from "payload";
import { revalidateAboutContent } from "../hooks/revalidateAboutContent.ts";

const PRODUCTION_ICON_OPTIONS = [
  { label: "Раскрой", value: "cut" },
  { label: "Нанесение/аппликация", value: "apply" },
  { label: "Сборка", value: "assemble" },
  { label: "Контроль", value: "inspect" },
  { label: "Упаковка", value: "pack" },
];

/**
 * Редакторский контент страницы "О нас" — от блока-интро "О компании" до
 * блока "История компании" включительно (остальные блоки страницы —
 * направления, награды, CTA — вне текущего объёма и остаются в коде).
 *
 * Порядок и состав секций фиксированы версткой (см. app/(frontend)/about/page.tsx),
 * поэтому используется global с именованными группами/массивами по секциям,
 * а не гибкий page-builder — так проще для администратора и предсказуемее
 * при рендере. Новая секция в будущем = новая группа здесь.
 */
export const AboutContent: GlobalConfig = {
  slug: "about-content",
  label: 'Страница "О нас"',
  access: {
    read: () => true,
    update: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "manager",
  },
  hooks: {
    afterChange: [revalidateAboutContent],
  },
  fields: [
    {
      name: "hero",
      type: "group",
      label: 'Вступление ("О компании")',
      fields: [
        {
          name: "eyebrow",
          type: "text",
          required: true,
          label: "Надпись над заголовком",
        },
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        { name: "lead", type: "textarea", required: true, label: "Текст" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Изображение",
          admin: {
            description:
              "Необязательно. Если не задано — показывается заглушка.",
          },
        },
        {
          name: "imageAlt",
          type: "text",
          required: true,
          label: "Alt-текст изображения",
          admin: {
            description: "Используется для заглушки и как запасной alt-текст.",
          },
        },
      ],
    },
    {
      name: "mediaBlocks",
      type: "array",
      label: "Блоки с фото и текстом",
      labels: { singular: "Блок", plural: "Блоки" },
      minRows: 1,
      admin: {
        description:
          "Чередующиеся блоки текста и изображений сразу после вступления.",
        initCollapsed: true,
      },
      fields: [
        { name: "eyebrow", type: "text", label: "Надпись над заголовком" },
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        {
          name: "paragraphs",
          type: "array",
          label: "Абзацы",
          labels: { singular: "Абзац", plural: "Абзацы" },
          minRows: 1,
          fields: [
            { name: "text", type: "textarea", required: true, label: "Текст" },
          ],
        },
        {
          name: "images",
          type: "array",
          label: "Изображения",
          labels: { singular: "Изображение", plural: "Изображения" },
          minRows: 1,
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Файл",
              admin: {
                description:
                  "Необязательно. Если не задано — показывается заглушка.",
              },
            },
            { name: "alt", type: "text", required: true, label: "Alt-текст" },
          ],
        },
      ],
    },
    {
      name: "callout",
      type: "group",
      label: "Цитата-врезка",
      fields: [
        { name: "text", type: "textarea", required: true, label: "Текст" },
      ],
    },
    {
      name: "production",
      type: "group",
      label: 'Производство ("Как рождается дорожный знак")',
      fields: [
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        {
          name: "subheading",
          type: "textarea",
          required: true,
          label: "Подзаголовок",
        },
        {
          name: "steps",
          type: "array",
          label: "Этапы",
          labels: { singular: "Этап", plural: "Этапы" },
          minRows: 1,
          fields: [
            { name: "title", type: "text", required: true, label: "Название" },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Описание",
            },
            {
              name: "icon",
              type: "select",
              required: true,
              label: "Иконка",
              options: PRODUCTION_ICON_OPTIONS,
            },
          ],
        },
      ],
    },
    {
      name: "productionWater",
      type: "group",
      label: 'Производство ("Как рождается водоналивной блок")',
      fields: [
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        {
          name: "subheading",
          type: "textarea",
          required: true,
          label: "Подзаголовок",
        },
        {
          name: "steps",
          type: "array",
          label: "Этапы",
          labels: { singular: "Этап", plural: "Этапы" },
          minRows: 1,
          fields: [
            { name: "title", type: "text", required: true, label: "Название" },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Описание",
            },
            {
              name: "icon",
              type: "select",
              required: true,
              label: "Иконка",
              options: PRODUCTION_ICON_OPTIONS,
            },
          ],
        },
      ],
    },
    {
      name: "standards",
      type: "group",
      label: "Стандарты и материалы",
      fields: [
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        {
          name: "paragraphs",
          type: "array",
          label: "Абзацы",
          labels: { singular: "Абзац", plural: "Абзацы" },
          minRows: 1,
          fields: [
            { name: "text", type: "textarea", required: true, label: "Текст" },
          ],
        },
        {
          name: "materials",
          type: "array",
          label: "Материалы",
          labels: { singular: "Материал", plural: "Материалы" },
          minRows: 1,
          fields: [
            { name: "title", type: "text", required: true, label: "Название" },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Описание",
            },
          ],
        },
        {
          name: "filmBrands",
          type: "array",
          label: "Бренды плёнок",
          labels: { singular: "Бренд", plural: "Бренды" },
          minRows: 1,
          fields: [
            { name: "name", type: "text", required: true, label: "Название" },
          ],
        },
      ],
    },
    {
      name: "quality",
      type: "group",
      label: "Контроль качества",
      fields: [
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        {
          name: "subheading",
          type: "textarea",
          required: true,
          label: "Подзаголовок",
        },
        {
          name: "checks",
          type: "array",
          label: "Пункты контроля",
          labels: { singular: "Пункт", plural: "Пункты" },
          minRows: 1,
          fields: [
            { name: "title", type: "text", required: true, label: "Название" },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Описание",
            },
          ],
        },
      ],
    },
    {
      name: "geography",
      type: "group",
      label: "География поставок",
      fields: [
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        {
          name: "subheading",
          type: "textarea",
          required: true,
          label: "Подзаголовок",
        },
        {
          name: "regionsCount",
          type: "text",
          required: true,
          label: "Количество регионов",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Карта регионов",
          admin: {
            description:
              "Необязательно. Если не задано — используется изображение по умолчанию.",
          },
        },
        {
          name: "routes",
          type: "array",
          label: "Трассы",
          labels: { singular: "Трасса", plural: "Трассы" },
          minRows: 1,
          fields: [
            { name: "name", type: "text", required: true, label: "Название" },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Описание",
            },
          ],
        },
      ],
    },
    {
      name: "directions",
      type: "group",
      label: "Направления деятельности",
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
          label: "Заголовок",
        },
        {
          name: "items",
          type: "array",
          label: "Направления",
          labels: {
            singular: "Направление",
            plural: "Направления",
          },
          minRows: 1,
          admin: {
            description:
              "Карточки направлений отображаются в указанном порядке.",
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              label: "Название",
            },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Описание",
            },
            {
              name: "href",
              type: "text",
              required: true,
              label: "Ссылка",
              admin: {
                description: "Например: /catalog/dorozhnye-znaki",
              },
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Изображение",
            },
            {
              name: "alt",
              type: "text",
              required: true,
              label: "Alt изображения",
            },
          ],
        },
      ],
    },
    {
      name: "timeline",
      type: "group",
      label: "История компании",
      fields: [
        { name: "heading", type: "text", required: true, label: "Заголовок" },
        {
          name: "subheading",
          type: "textarea",
          required: true,
          label: "Подзаголовок",
        },
        {
          name: "events",
          type: "array",
          label: "События",
          labels: { singular: "Событие", plural: "События" },
          minRows: 1,
          admin: {
            description: "Отображаются в том порядке, в котором указаны здесь.",
          },
          fields: [
            { name: "year", type: "text", required: true, label: "Год" },
            { name: "title", type: "text", required: true, label: "Заголовок" },
            {
              name: "description",
              type: "textarea",
              required: true,
              label: "Описание",
            },
            {
              name: "highlight",
              type: "text",
              label: "Отметка (необязательно)",
            },
          ],
        },
      ],
    },
  ],
};
