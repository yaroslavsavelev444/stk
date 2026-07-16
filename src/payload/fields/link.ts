import type { Field } from "payload";

/**
 * Переиспользуемая ссылка кнопки: поддерживает внутренние страницы сайта
 * (относительный путь, начинается с "/") и внешние ссылки (полный адрес
 * с http:// или https://). Используется везде, где редактор может указать
 * ссылку на кнопку/CTA (например, карточки блока преимуществ на главной).
 */
export const linkField: Field = {
  name: "link",
  type: "group",
  label: "Ссылка кнопки",
  fields: [
    {
      name: "type",
      type: "select",
      label: "Тип ссылки",
      required: true,
      defaultValue: "internal",
      options: [
        { label: "Внутренняя страница", value: "internal" },
        { label: "Внешняя ссылка", value: "external" },
      ],
    },
    {
      name: "url",
      type: "text",
      label: "Адрес",
      required: true,
      admin: {
        description:
          'Внутренняя страница — путь вида "/catalog" или "/contacts". Внешняя ссылка — полный адрес, начинающийся с http:// или https://.',
      },
      validate: (
        value: string | null | undefined,
        { siblingData }: { siblingData?: { type?: string } },
      ) => {
        if (!value) return "Укажите адрес ссылки";
        const linkType = siblingData?.type;
        if (linkType === "external") {
          try {
            const parsed = new URL(value);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
              return "Внешняя ссылка должна начинаться с http:// или https://";
            }
            return true;
          } catch {
            return "Укажите корректную внешнюю ссылку";
          }
        }
        if (!value.startsWith("/")) {
          return 'Внутренняя ссылка должна начинаться с "/", например /catalog';
        }
        return true;
      },
    },
  ],
};
