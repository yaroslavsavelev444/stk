import type { GlobalConfig } from "payload";
import { linkField } from "../fields/link.ts";
import { revalidateHomeContent } from "../hooks/revalidateHomeContent.ts";

export const HomeContent: GlobalConfig = {
  slug: "home-content",
  label: "Главная страница",
  access: {
    read: () => true,
    update: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "manager",
  },
  hooks: {
    afterChange: [revalidateHomeContent],
  },
  fields: [
    {
      name: "aboutIntro",
      type: "group",
      label: 'Блок "О компании"',
      admin: {
        description:
          'Вступительный блок сразу под первым экраном главной страницы, начинается с надписи "О компании".',
      },
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
            description:
              "Используется для заглушки, если изображение не загружено, и как запасной alt-текст.",
          },
        },
      ],
    },
    {
      name: "featureCards",
      type: "array",
      label: "Карточки блока преимуществ",
      labels: { singular: "Карточка", plural: "Карточки" },
      minRows: 2,
      admin: {
        description:
          "Блок из карточек перед секцией «Почему выбирают СТК-Актив». Количество карточек должно быть чётным — на десктопе они располагаются по 2 в ряд.",
        initCollapsed: true,
      },
      validate: (value) => {
        if (!Array.isArray(value)) return true;
        if (value.length > 0 && value.length % 2 !== 0) {
          return "Количество карточек должно быть чётным (2, 4, 6…)";
        }
        return true;
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Изображение",
        },
        { name: "title", type: "text", required: true, label: "Заголовок" },
        {
          name: "description",
          type: "textarea",
          required: true,
          label: "Описание",
        },
        {
          name: "buttonText",
          type: "text",
          required: true,
          label: "Текст кнопки",
        },
        linkField,
      ],
    },
    // ↓ новая секция
    {
      name: "whyUs",
      type: "group",
      label: 'Секция "Почему выбирают СТК-Актив"',
      admin: {
        description:
          "Bento-грид преимуществ на главной. Первая карточка в списке всегда отображается крупной (hero) — ставьте туда самый весомый аргумент.",
      },
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
          label: "Заголовок секции",
        },
        {
          name: "subheading",
          type: "textarea",
          required: true,
          label: "Подзаголовок",
        },
        {
          name: "items",
          type: "array",
          label: "Карточки преимуществ",
          labels: { singular: "Карточка", plural: "Карточки" },
          minRows: 4,
          maxRows: 4,
          admin: {
            description:
              "Ровно 4 карточки — так рассчитана вёрстка (первая крупная, остальные три компактные). Порядок важен: 1-я карточка = hero.",
            initCollapsed: true,
          },
          fields: [
            { name: "title", type: "text", required: true, label: "Заголовок" },
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
              options: [
                { label: "Завод (производство)", value: "factory" },
                { label: "Щит (гарантия/стандарты)", value: "shield" },
                { label: "Сертификат", value: "certificate" },
                { label: "Маршрут (логистика/география)", value: "route" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
