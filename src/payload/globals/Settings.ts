import type { GlobalConfig } from "payload";
import { seoField } from "../fields/seo.ts";
import { revalidateSettings } from "../hooks/revalidateSettings";

export const Settings: GlobalConfig = {
  slug: "settings",

  label: "Настройки сайта",

  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
  },

  hooks: {
    afterChange: [revalidateSettings],
  },

  fields: [
    {
      name: "companyName",
      type: "text",
      label: "Название организации",
      required: true,
    },

    {
      name: "companyEmail",
      type: "email",
      label: "Общая почта организации",
      admin: {
        description: "Основная почта организации. Например: info@example.com",
      },
    },

    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },

    /**
     * Менеджеры организации
     */
    {
      name: "managers",
      type: "array",
      label: "Менеджеры",

      admin: {
        description:
          "Добавьте сотрудников с контактными данными. Количество менеджеров не ограничено.",
      },

      fields: [
        {
          name: "name",
          type: "text",
          label: "Имя менеджера",
          required: true,
        },

        {
          name: "email",
          type: "email",
          label: "Email менеджера",
          required: true,
        },

        {
          name: "phone",
          type: "text",
          label: "Телефон менеджера",
          required: true,
        },

        {
          name: "order",
          type: "number",
          label: "Порядок отображения",
          defaultValue: 0,
        },
      ],
    },

    /**
     * Общие контакты организации
     */
    {
      name: "contacts",
      type: "array",
      label: "Контакты",

      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Название",
        },

        {
          name: "value",
          type: "text",
          required: true,
          label: "Значение",
        },

        {
          name: "type",
          type: "select",

          options: [
            {
              label: "Текст",
              value: "text",
            },

            {
              label: "Телефон",
              value: "phone",
            },

            {
              label: "Email",
              value: "email",
            },

            {
              label: "Ссылка",
              value: "link",
            },

            {
              label: "WhatsApp",
              value: "whatsapp",
            },

            {
              label: "Telegram",
              value: "telegram",
            },
          ],
        },

        {
          name: "icon",
          type: "text",
          label: "Иконка (FontAwesome класс или URL)",
        },

        {
          name: "order",
          type: "number",
          defaultValue: 0,
        },
      ],
    },

    /**
     * Социальные сети
     */
    {
      name: "socials",
      type: "array",
      label: "Соцсети",

      fields: [
        {
          name: "title",
          type: "text",
        },

        {
          name: "url",
          type: "text",
          required: true,
        },

        {
          name: "icon",
          type: "text",
        },
      ],
    },

    {
      name: "workingHours",
      type: "text",
      label: "Часы работы",
    },

    {
      name: "map",
      type: "textarea",
      label: "Код Яндекс.Карты (iframe src или embed)",
    },

    /**
     * Hero background
     */
    {
      name: "heroBackground",
      type: "group",
      label: "Фон первого экрана (Hero)",

      fields: [
        {
          name: "type",
          type: "select",
          label: "Тип фона",

          defaultValue: "none",

          options: [
            {
              label: "Нет",
              value: "none",
            },

            {
              label: "Изображение",
              value: "image",
            },

            {
              label: "Видео",
              value: "video",
            },
          ],
        },

        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Фоновое изображение",

          admin: {
            condition: (_, siblingData) => siblingData?.type === "image",
          },
        },

        {
          name: "video",
          type: "upload",
          relationTo: "media",
          label: "Фоновое видео",

          admin: {
            condition: (_, siblingData) => siblingData?.type === "video",
          },
        },

        {
          name: "videoPoster",
          type: "upload",
          relationTo: "media",
          label: "Постер видео",

          admin: {
            condition: (_, siblingData) => siblingData?.type === "video",
          },
        },
      ],
    },

    seoField,
  ],
};
