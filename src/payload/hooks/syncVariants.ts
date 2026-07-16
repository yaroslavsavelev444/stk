import type { CollectionBeforeValidateHook } from "payload";
import {
  minCombinationPrice,
  normalizeGroups,
  reconcileCombinations,
} from "../variants/logic.ts";

/**
 * beforeValidate — авторитетная нормализация вариаций перед валидацией полей.
 *
 * Что делает (только когда useVariants === true):
 *  1. Проставляет стабильные коды группам и значениям (для URL и ключей).
 *  2. Пересобирает variantCombinations под текущие группы, сохраняя введённые
 *     цены по ключу (автогенерация комбинаций — админ не создаёт их вручную).
 *  3. Подставляет базовую `price` = минимальная заполненная цена комбинаций,
 *     чтобы карточки и каталог показывали «от X ₽» без выбора варианта.
 *
 * Завершённость цен проверяется отдельно — field-level `validate` на цене
 * комбинации (см. src/payload/fields/variants.ts). Чтобы новые сгенерированные
 * строки успели появиться в админке до требования цены, хук выставляет флаг
 * `req.context.variantsStructureChanged`: когда набор комбинаций изменился,
 * валидатор цены пропускает это сохранение (строки сохранятся пустыми), а
 * следующее сохранение уже жёстко требует все цены.
 */
export const syncVariants: CollectionBeforeValidateHook = ({ data, req }) => {
  if (!data) return data;

  if (!data.useVariants) {
    // Варианты выключены — товар работает по обычной `price`.
    // Данные групп/комбинаций не трогаем (сохранятся на случай повторного
    // включения), фронтенд их игнорирует.
    if (req?.context) req.context.variantsStructureChanged = false;
    return data;
  }

  const normalized = normalizeGroups(data.variantGroups);

  // Записываем нормализованные коды обратно в группы/значения.
  data.variantGroups = normalized.map((group) => ({
    label: group.label,
    code: group.code,
    displayType: group.displayType,
    values: group.values.map((v) => ({ label: v.label, code: v.code })),
  }));

  // Пересобираем комбинации, сохраняя цены.
  const combinations = reconcileCombinations(normalized, data.variantCombinations);

  // Изменился ли набор комбинаций (добавлены/удалены) по сравнению с присланным?
  const incomingKeys = new Set(
    (Array.isArray(data.variantCombinations) ? data.variantCombinations : [])
      .map((c: { key?: string | null }) => c?.key)
      .filter(Boolean),
  );
  const structureChanged =
    incomingKeys.size !== combinations.length ||
    combinations.some((c) => !incomingKeys.has(c.key));
  if (req?.context) req.context.variantsStructureChanged = structureChanged;

  data.variantCombinations = combinations;

  // Базовая цена для каталога = минимальная заполненная цена комбинации.
  const min = minCombinationPrice(combinations);
  if (typeof min === "number") {
    data.price = min;
  }

  return data;
};
