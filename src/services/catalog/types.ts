/**
 * Общая модель каталога для сервера и клиента.
 *
 * Модуль намеренно не импортирует ничего из Payload/Next: его типы и чистые
 * функции нужны и серверным загрузчикам (src/services/payload/catalog.ts), и
 * клиентскому бесконечному скроллу (src/components/products/CatalogProducts.tsx).
 */

/**
 * Размер порции: и страница внутри группы в БД, и минимальный размер ответа
 * API подгрузки. Одно число на оба случая — так границы порций совпадают с
 * границами кэшируемых страниц групп, и ни один запрос не тянет из БД лишнего.
 */
export const CATALOG_PAGE_SIZE = 24;

/** Ключ псевдогруппы «Другие товары» — товары без (опубликованной) подкатегории. */
export const OTHER_GROUP_KEY = "__other";

/** Заголовок псевдогруппы «Другие товары». */
export const OTHER_GROUP_NAME = "Другие товары";

/** Максимум подкатегорий в параметре `sub` — защита от мусорных URL. */
export const MAX_SELECTED_SUBCATEGORIES = 50;

/**
 * Товар в том виде, в котором его показывает карточка каталога. Ровно те поля,
 * что рисует ProductCard, — без attributes/variants/documents/seo, из-за
 * которых полный документ товара весит килобайты вместо сотен байт.
 */
export interface CatalogCardProduct {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  description: string | null;
  price: number | null;
  showPrice: boolean;
  /** Цена показывается как «от X ₽» (у товара есть варианты). */
  priceFrom: boolean;
  badges: string[];
  image: { url: string; alt: string } | null;
  /** Ключ группы, к которой относится товар, — по нему клиент рисует заголовки секций. */
  groupKey: string;
}

/** Группа товаров на странице категории: подкатегория либо «Другие товары». */
export interface CatalogGroup {
  key: string;
  name: string;
  total: number;
}

/** Позиция в потоке товаров: индекс группы и страница внутри неё (обе с нуля). */
export interface CatalogCursor {
  group: number;
  page: number;
}

/** Порция товаров и позиция следующей (null — товары закончились). */
export interface CatalogChunk {
  items: CatalogCardProduct[];
  cursor: CatalogCursor | null;
}

/**
 * «Скелет» страницы категории: сама категория и размеры групп. Достаточно,
 * чтобы отрисовать фильтр и заголовки секций и посчитать любую позицию
 * курсора — без единого товара в памяти.
 */
export interface CatalogStructure {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  /** Подкатегории категории в порядке отображения, только непустые. */
  subcategories: Array<{ id: string; name: string; count: number }>;
  /** Сколько товаров категории не попало ни в одну опубликованную подкатегорию. */
  otherCount: number;
}

/**
 * Разбирает query-параметр `sub` в список id подкатегорий.
 *
 * Отбрасывает всё, чего нет в этой категории: краулеры перебирают произвольные
 * комбинации `sub=`, и без валидации каждый такой URL превращался бы в новый
 * запрос к БД. Порядок результата — ПОРЯДОК В URL: он же порядок выбора
 * пользователем (последняя выбранная подкатегория стоит первой, см. buildHref
 * в SubcategoryFilters) и он же порядок групп товаров на странице. Поэтому
 * `sub=a,b` и `sub=b,a` — две разные страницы с разным порядком секций.
 *
 * На кэш это не влияет: страницы групп кэшируются по (категория, группа,
 * номер страницы) и переиспользуются любым порядком и любой комбинацией `sub`.
 */
export function parseSubParam(
  sub: string | null | undefined,
  structure: CatalogStructure,
): string[] {
  if (!sub) return [];

  const known = new Set(
    structure.subcategories.map((subcategory) => subcategory.id),
  );

  const selected: string[] = [];
  const seen = new Set<string>();

  for (const raw of sub.split(",").slice(0, MAX_SELECTED_SUBCATEGORIES)) {
    const id = raw.trim();
    // Дубль в URL не должен ни ломать порядок, ни удваивать группу: первое
    // вхождение задаёт позицию, остальные игнорируются.
    if (!id || seen.has(id) || !known.has(id)) continue;
    seen.add(id);
    selected.push(id);
  }

  return selected;
}

/**
 * Собирает `sub` обратно в строку запроса (пустой список — параметра нет).
 * Порядок сохраняется: он и есть приоритет подкатегорий.
 */
export function encodeSubParam(selectedIds: string[]): string {
  return selectedIds.join(",");
}

/**
 * Группы, видимые при текущем фильтре, — в том порядке, в котором они идут в
 * ленте товаров.
 *
 * Без фильтра — все непустые подкатегории в порядке из админки плюс «Другие
 * товары» в конце. С фильтром — только выбранные подкатегории, и порядок
 * задаёт `selectedIds`, то есть выбор пользователя: последняя выбранная
 * подкатегория идёт первой. Раз пользователь явно сузил выборку, товары вне
 * неё показывать не нужно.
 *
 * Порядок групп — единственный источник порядка товаров: курсор адресует
 * позицию как (индекс группы, страница внутри группы), поэтому подгрузка
 * следующих порций идёт по этому же списку и порядок сохраняется на всём
 * наборе результатов, а не только в первой порции.
 */
export function getVisibleGroups(
  structure: CatalogStructure,
  selectedIds: string[],
): CatalogGroup[] {
  const toGroup = (subcategory: CatalogStructure["subcategories"][number]) => ({
    key: subcategory.id,
    name: subcategory.name,
    total: subcategory.count,
  });

  if (selectedIds.length > 0) {
    const byId = new Map(
      structure.subcategories.map((subcategory) => [
        subcategory.id,
        subcategory,
      ]),
    );

    return selectedIds
      .map((id) => byId.get(id))
      .filter((subcategory) => subcategory !== undefined)
      .map(toGroup);
  }

  const groups: CatalogGroup[] = structure.subcategories.map(toGroup);

  if (structure.otherCount > 0) {
    groups.push({
      key: OTHER_GROUP_KEY,
      name: OTHER_GROUP_NAME,
      total: structure.otherCount,
    });
  }

  return groups;
}

/** Всего товаров во всех видимых группах. */
export function countProducts(groups: CatalogGroup[]): number {
  return groups.reduce((total, group) => total + group.total, 0);
}

/** Сколько страниц в группе. */
function pagesInGroup(group: CatalogGroup): number {
  return Math.ceil(group.total / CATALOG_PAGE_SIZE);
}

/** Курсор указывает на существующую страницу существующей группы. */
export function isValidCursor(
  groups: CatalogGroup[],
  cursor: CatalogCursor,
): boolean {
  const group = groups[cursor.group];
  if (!group) return false;
  return cursor.page >= 0 && cursor.page < pagesInGroup(group);
}

/**
 * Следующая позиция: либо следующая страница текущей группы, либо начало
 * ближайшей непустой группы дальше по списку. null — товары закончились.
 */
export function advanceCursor(
  groups: CatalogGroup[],
  cursor: CatalogCursor,
): CatalogCursor | null {
  const group = groups[cursor.group];
  if (!group) return null;

  if (cursor.page + 1 < pagesInGroup(group)) {
    return { group: cursor.group, page: cursor.page + 1 };
  }

  for (let index = cursor.group + 1; index < groups.length; index++) {
    if (groups[index].total > 0) return { group: index, page: 0 };
  }

  return null;
}
