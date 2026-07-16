import type { Field } from "payload";
import { MAX_GROUPS, MAX_VALUES_PER_GROUP } from "../variants/logic.ts";

/**
 * Поля системы вариаций товара. Спредятся в коллекцию Products.
 *
 * Модель:
 *  - useVariants        — переключатель «Использовать варианты».
 *  - variantGroups      — 1..2 группы (напр. «Цвет», «Память»), у каждой тип
 *                          отображения и до 10 значений.
 *  - variantCombinations — цены комбинаций. Генерируются автоматически серверным
 *                          хуком syncVariants (админ только заполняет цены).
 *
 * Универсально: никакой привязки к «цвет/размер/объём» — только произвольные
 * названия групп и значений.
 */

const helperText =
  "Цена рассчитывается из выбранной комбинации на странице товара. " +
  "Поле «Цена» остаётся базовой ценой для каталога (подставляется минимум).";

export const variantFields: Field[] = [
  {
    name: "useVariants",
    type: "checkbox",
    defaultValue: false,
    label: "Использовать варианты товара",
    admin: {
      description: helperText,
    },
  },

  {
    name: "variantGroups",
    type: "array",
    label: "Группы вариантов",
    minRows: 1,
    maxRows: MAX_GROUPS,
    admin: {
      condition: (data) => Boolean(data?.useVariants),
      description: `Максимум ${MAX_GROUPS} группы. У каждой — тип отображения и до ${MAX_VALUES_PER_GROUP} значений. Коды для URL генерируются автоматически.`,
      initCollapsed: false,
    },
    fields: [
      {
        name: "label",
        type: "text",
        required: true,
        label: "Название группы",
        admin: { placeholder: "Напр. Цвет" },
      },
      {
        name: "displayType",
        type: "select",
        required: true,
        defaultValue: "list",
        label: "Тип отображения",
        options: [
          { label: "Список выбора (кнопки)", value: "list" },
          { label: "Выпадающий список", value: "dropdown" },
        ],
      },
      {
        name: "code",
        type: "text",
        label: "Код (URL)",
        admin: {
          readOnly: true,
          description: "Генерируется автоматически из названия.",
          width: "50%",
        },
      },
      {
        name: "values",
        type: "array",
        label: "Значения",
        required: true,
        minRows: 1,
        maxRows: MAX_VALUES_PER_GROUP,
        admin: {
          description: `До ${MAX_VALUES_PER_GROUP} значений.`,
        },
        fields: [
          {
            type: "row",
            fields: [
              {
                name: "label",
                type: "text",
                required: true,
                label: "Значение",
                admin: { width: "60%", placeholder: "Напр. Чёрный" },
              },
              {
                name: "code",
                type: "text",
                label: "Код (URL)",
                admin: {
                  readOnly: true,
                  width: "40%",
                  description: "Авто.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  {
    name: "variantCombinations",
    type: "array",
    label: "Цены комбинаций",
    admin: {
      condition: (data) =>
        Boolean(data?.useVariants) &&
        Array.isArray(data?.variantGroups) &&
        data.variantGroups.length > 0,
      description:
        "Комбинации генерируются автоматически при сохранении. Заполните цену для каждой. Не добавляйте и не удаляйте строки вручную — они пересобираются из групп.",
      initCollapsed: false,
    },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "label",
            type: "text",
            label: "Комбинация",
            admin: { readOnly: true, width: "55%" },
          },
          {
            name: "price",
            type: "number",
            label: "Цена, ₽",
            admin: { step: 0.01, width: "45%", placeholder: "0" },
            validate: (
              value: number | null | undefined,
              options: { data?: { useVariants?: boolean | null }; req?: { context?: Record<string, unknown> } },
            ): string | true => {
              const { data, req } = options ?? {};
              if (!data?.useVariants) return true;
              // Набор комбинаций только что изменился — даём строкам сохраниться
              // пустыми, цену потребуем на следующем сохранении.
              if (req?.context?.variantsStructureChanged) return true;
              if (value === null || value === undefined) {
                return "Укажите цену для этой комбинации";
              }
              if (typeof value === "number" && value <= 0) {
                return "Цена должна быть больше 0";
              }
              return true;
            },
          },
        ],
      },
      {
        name: "key",
        type: "text",
        required: true,
        admin: {
          readOnly: true,
          hidden: true,
        },
      },
    ],
  },
];
