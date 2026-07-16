import { slugify } from "transliteration";

/**
 * Универсальная логика вариаций товара — без привязки к «цвету/размеру».
 * Один источник правды для: серверного хука Payload, кастомного admin-поля
 * и фронтенда страницы товара. Чистые функции, безопасны и на сервере, и в
 * браузере (transliteration работает в обоих окружениях).
 */

// ─── Ограничения (см. ТЗ) ─────────────────────────────────────────────────
export const MAX_GROUPS = 2;
export const MAX_VALUES_PER_GROUP = 10;

// ─── Типы ─────────────────────────────────────────────────────────────────

export interface VariantValueInput {
  label?: string | null;
  code?: string | null;
}

export interface VariantGroupInput {
  label?: string | null;
  code?: string | null;
  displayType?: "dropdown" | "list" | null;
  values?: VariantValueInput[] | null;
}

export interface CombinationInput {
  key?: string | null;
  label?: string | null;
  price?: number | null;
}

/** Нормализованное значение с гарантированным непустым кодом. */
export interface NormalizedValue {
  label: string;
  code: string;
}

/** Нормализованная группа с гарантированными кодами. */
export interface NormalizedGroup {
  label: string;
  code: string;
  displayType: "dropdown" | "list";
  values: NormalizedValue[];
}

/** Сгенерированная комбинация. */
export interface GeneratedCombination {
  key: string;
  label: string;
  price: number | null;
}

/** Выбор пользователя: { groupCode: valueCode }. */
export type VariantSelection = Record<string, string>;

// ─── Слаг/код ─────────────────────────────────────────────────────────────

function toSlug(input: string): string {
  const base = slugify(input || "", { lowercase: true, separator: "-" });
  return base || "v";
}

/** Уникальный код в рамках набора уже занятых кодов. */
function uniqueCode(source: string, used: Set<string>): string {
  const base = toSlug(source);
  let code = base;
  let i = 2;
  while (used.has(code)) {
    code = `${base}-${i}`;
    i += 1;
  }
  used.add(code);
  return code;
}

// ─── Нормализация групп ───────────────────────────────────────────────────

/**
 * Приводит группы к нормализованному виду: отбрасывает пустые группы/значения,
 * проставляет недостающие коды (стабильно: существующие коды сохраняются),
 * применяет лимиты. Возвращает НОВЫЕ объекты (не мутирует вход).
 */
export function normalizeGroups(
  groups: VariantGroupInput[] | null | undefined,
): NormalizedGroup[] {
  if (!Array.isArray(groups)) return [];

  const usedGroupCodes = new Set<string>();

  return groups
    .filter((g) => g && (g.label || "").trim().length > 0)
    .slice(0, MAX_GROUPS)
    .map((g) => {
      const label = (g.label || "").trim();
      const displayType: "dropdown" | "list" =
        g.displayType === "dropdown" ? "dropdown" : "list";

      const code =
        g.code && g.code.trim()
          ? uniqueCode(g.code.trim(), usedGroupCodes)
          : uniqueCode(label, usedGroupCodes);

      const usedValueCodes = new Set<string>();
      const values = (Array.isArray(g.values) ? g.values : [])
        .filter((v) => v && (v.label || "").trim().length > 0)
        .slice(0, MAX_VALUES_PER_GROUP)
        .map((v) => {
          const vLabel = (v.label || "").trim();
          const vCode =
            v.code && v.code.trim()
              ? uniqueCode(v.code.trim(), usedValueCodes)
              : uniqueCode(vLabel, usedValueCodes);
          return { label: vLabel, code: vCode };
        });

      return { label, code, displayType, values };
    })
    .filter((g) => g.values.length > 0);
}

// ─── Ключ комбинации ──────────────────────────────────────────────────────

/**
 * Детерминированный ключ комбинации из выбранных кодов значений — в порядке
 * групп. Один и тот же алгоритм на сервере и клиенте гарантирует совпадение.
 */
export function buildCombinationKey(
  groups: NormalizedGroup[],
  selection: VariantSelection,
): string | null {
  const parts: string[] = [];
  for (const group of groups) {
    const valueCode = selection[group.code];
    if (!valueCode) return null;
    if (!group.values.some((v) => v.code === valueCode)) return null;
    parts.push(`${group.code}:${valueCode}`);
  }
  if (parts.length !== groups.length || parts.length === 0) return null;
  return parts.join("|");
}

// ─── Декартово произведение ───────────────────────────────────────────────

/** Все комбинации значений по группам (1 или 2 группы). */
export function generateCombinations(
  groups: NormalizedGroup[],
): { key: string; label: string }[] {
  if (groups.length === 0) return [];

  let acc: { codes: string[]; labels: string[] }[] = [
    { codes: [], labels: [] },
  ];

  for (const group of groups) {
    const next: { codes: string[]; labels: string[] }[] = [];
    for (const combo of acc) {
      for (const value of group.values) {
        next.push({
          codes: [...combo.codes, `${group.code}:${value.code}`],
          labels: [...combo.labels, value.label],
        });
      }
    }
    acc = next;
  }

  return acc.map((c) => ({ key: c.codes.join("|"), label: c.labels.join(" / ") }));
}

// ─── Согласование комбинаций (сохранение цен) ─────────────────────────────

/**
 * Пересобирает массив комбинаций под текущие группы, СОХРАНЯЯ уже введённые
 * цены по ключу. Новые комбинации получают price=null, устаревшие удаляются.
 */
export function reconcileCombinations(
  groups: NormalizedGroup[],
  existing: CombinationInput[] | null | undefined,
): GeneratedCombination[] {
  const priceByKey = new Map<string, number | null>();
  if (Array.isArray(existing)) {
    for (const c of existing) {
      if (c?.key) {
        priceByKey.set(
          c.key,
          typeof c.price === "number" ? c.price : null,
        );
      }
    }
  }

  return generateCombinations(groups).map((c) => ({
    key: c.key,
    label: c.label,
    price: priceByKey.has(c.key) ? (priceByKey.get(c.key) ?? null) : null,
  }));
}

// ─── Цены для каталога ────────────────────────────────────────────────────

/** Минимальная заполненная цена среди комбинаций (для «от X ₽» в каталоге). */
export function minCombinationPrice(
  combinations: CombinationInput[] | null | undefined,
): number | null {
  if (!Array.isArray(combinations)) return null;
  const prices = combinations
    .map((c) => (typeof c?.price === "number" ? c.price : null))
    .filter((p): p is number => p !== null && p > 0);
  return prices.length ? Math.min(...prices) : null;
}

/** Полностью ли заполнены цены всех комбинаций. */
export function areCombinationsComplete(
  groups: NormalizedGroup[],
  combinations: CombinationInput[] | null | undefined,
): boolean {
  const expected = generateCombinations(groups);
  if (expected.length === 0) return false;
  const priceByKey = new Map<string, number | null>();
  if (Array.isArray(combinations)) {
    for (const c of combinations) {
      if (c?.key) priceByKey.set(c.key, typeof c.price === "number" ? c.price : null);
    }
  }
  return expected.every((c) => {
    const price = priceByKey.get(c.key);
    return typeof price === "number" && price > 0;
  });
}
