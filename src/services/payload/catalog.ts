import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import {
  advanceCursor,
  CATALOG_PAGE_SIZE,
  type CatalogCardProduct,
  type CatalogChunk,
  type CatalogCursor,
  type CatalogGroup,
  type CatalogStructure,
  isValidCursor,
  OTHER_GROUP_KEY,
} from "@/services/catalog/types";
import { getPayloadInstance } from "./getPayload";

/**
 * Загрузка каталога порциями.
 *
 * Страница категории раньше тянула ВСЕ товары категории целиком (limit 1000,
 * depth 1) и рисовала их одним HTML: полный документ товара везёт с собой
 * attributes / variantCombinations / documents / seo, поэтому на крупной
 * категории объект разрастался до ~10 МБ — больше лимита data cache Next.js
 * (2 МБ), кэш молча не записывался, и каждый запрос считался с нуля.
 *
 * Здесь данные разложены на две независимо кэшируемые части:
 *
 *  1. «Структура» категории — подкатегории и КОЛИЧЕСТВО товаров в каждой.
 *     Одна запись кэша на категорию, единицы килобайт, переиспользуется всеми
 *     комбинациями фильтра.
 *  2. Страницы групп — по {@link CATALOG_PAGE_SIZE} товаров, только поля
 *     карточки. Ключ кэша — (категория, группа, номер страницы), он НЕ зависит
 *     от набора выбранных подкатегорий. Поэтому перебор краулерами любых
 *     комбинаций `?sub=` не плодит записи кэша и не добавляет запросов к БД.
 */

/** Сколько страниц групп максимум склеивается в одну порцию ответа. */
const MAX_PAGE_FETCHES_PER_CHUNK = 6;

/**
 * Описание в карточке обрезано двумя строками CSS, поэтому длинный текст
 * целиком — чистый вес в ответе. 240 символов заведомо перекрывают видимую
 * часть на любом экране.
 */
const DESCRIPTION_MAX_LENGTH = 240;

/** Поля товара, которые реально рисует карточка каталога. */
const CARD_SELECT = {
  name: true,
  slug: true,
  description: true,
  price: true,
  showPrice: true,
  useVariants: true,
  badges: true,
  images: true,
} as const;

interface CardDoc {
  id: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  price?: number | null;
  showPrice?: boolean | null;
  useVariants?: boolean | null;
  badges?: string[] | null;
  images?: unknown;
}

/**
 * Media отдаёт абсолютный URL, а карточке нужен путь — иначе Next/Image уходит
 * на внешний хост вместо локальной оптимизации.
 */
function toMediaPathname(url: string): string {
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    return url;
  }
}

function firstImageId(doc: CardDoc): string | null {
  if (!Array.isArray(doc.images)) return null;
  const first = doc.images[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "id" in first) {
    return String((first as { id: unknown }).id);
  }
  return null;
}

type ImageMap = Map<string, { url: string; alt: string }>;

/**
 * Одним запросом достаёт обложки для всей страницы товаров. Отдельный запрос
 * вместо depth: 1 — populate тянул бы Media целиком, вместе со всеми
 * сгенерированными размерами, ради двух полей.
 */
async function fetchCardImages(docs: CardDoc[]): Promise<ImageMap> {
  const ids = [
    ...new Set(
      docs.map(firstImageId).filter((id): id is string => Boolean(id)),
    ),
  ];
  if (ids.length === 0) return new Map();

  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: "media",
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    pagination: false,
    // filename обязателен, хотя карточке и не нужен: Payload собирает `url`
    // upload-коллекции из имени файла уже после выборки, и без него в ответ
    // приходит url: null.
    select: { url: true, alt: true, filename: true },
  });

  const map: ImageMap = new Map();
  for (const media of result.docs) {
    if (!media.url) continue;
    map.set(String(media.id), {
      url: toMediaPathname(media.url),
      alt: media.alt || "",
    });
  }
  return map;
}

function toCardProduct(
  doc: CardDoc,
  images: ImageMap,
  categorySlug: string,
  groupKey: string,
): CatalogCardProduct {
  const imageId = firstImageId(doc);
  const image = imageId ? images.get(imageId) : undefined;
  const description = doc.description?.trim();

  return {
    id: String(doc.id),
    name: doc.name ?? "",
    slug: doc.slug ?? "",
    categorySlug,
    description: description
      ? description.slice(0, DESCRIPTION_MAX_LENGTH)
      : null,
    price: typeof doc.price === "number" ? doc.price : null,
    showPrice: doc.showPrice !== false,
    priceFrom: doc.useVariants === true,
    badges: Array.isArray(doc.badges) ? doc.badges : [],
    image: image
      ? { url: image.url, alt: image.alt || doc.name || "Товар" }
      : null,
    groupKey,
  };
}

// ─── Структура категории ─────────────────────────────────────────────────────

function sortSubcategories<T extends { order?: number | null }>(
  docs: T[],
): T[] {
  return [...docs].sort((a, b) => {
    const aOrder =
      typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
    const bOrder =
      typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
}

async function fetchCatalogStructure(
  categorySlug: string,
): Promise<CatalogStructure | null> {
  const payload = await getPayloadInstance();

  const categories = await payload.find({
    collection: "categories",
    where: { slug: { equals: categorySlug }, isPublished: { equals: true } },
    limit: 1,
    depth: 0,
    select: { name: true, slug: true, description: true },
  });

  const category = categories.docs[0];
  if (!category) return null;

  const categoryId = String(category.id);
  const inCategory: Where = {
    category: { equals: categoryId },
    isPublished: { equals: true },
  };

  const subcategoryDocs = await payload.find({
    collection: "subcategories",
    where: { category: { equals: categoryId }, isPublished: { equals: true } },
    depth: 0,
    limit: 200,
    pagination: false,
    select: { name: true, order: true },
  });

  const ordered = sortSubcategories(subcategoryDocs.docs);
  const subcategoryIds = ordered.map((subcategory) => String(subcategory.id));

  const counts = await Promise.all(
    subcategoryIds.map((id) =>
      payload.count({
        collection: "products",
        where: { ...inCategory, subcategory: { equals: id } },
      }),
    ),
  );

  // $nin в Mongo истинен и для отсутствующего поля, поэтому одно условие
  // покрывает и товары без подкатегории, и товары с уже неопубликованной.
  const other = await payload.count({
    collection: "products",
    where:
      subcategoryIds.length > 0
        ? { ...inCategory, subcategory: { not_in: subcategoryIds } }
        : inCategory,
  });

  return {
    category: {
      id: categoryId,
      name: category.name,
      slug: category.slug,
      description: category.description ?? null,
    },
    subcategories: ordered
      .map((subcategory, index) => ({
        id: String(subcategory.id),
        name: subcategory.name,
        count: counts[index].totalDocs,
      }))
      // Фильтр, ведущий в заведомо пустой список, — плохой UX.
      .filter((subcategory) => subcategory.count > 0),
    otherCount: other.totalDocs,
  };
}

export const getCachedCatalogStructure = (categorySlug: string) =>
  process.env.NODE_ENV === "development"
    ? () => fetchCatalogStructure(categorySlug)
    : unstable_cache(
        () => fetchCatalogStructure(categorySlug),
        [`catalog-structure-${categorySlug}`],
        { tags: ["products"], revalidate: false },
      );

// ─── Страница одной группы ───────────────────────────────────────────────────

interface GroupPageArgs {
  categoryId: string;
  categorySlug: string;
  groupKey: string;
  /** Страница внутри группы, с нуля. */
  page: number;
  /** Все опубликованные подкатегории категории — нужны только группе «Другие». */
  subcategoryIds: string[];
}

async function fetchGroupPage({
  categoryId,
  categorySlug,
  groupKey,
  page,
  subcategoryIds,
}: GroupPageArgs): Promise<CatalogCardProduct[]> {
  const payload = await getPayloadInstance();

  const where: Where = {
    category: { equals: categoryId },
    isPublished: { equals: true },
  };

  if (groupKey !== OTHER_GROUP_KEY) {
    where.subcategory = { equals: groupKey };
  } else if (subcategoryIds.length > 0) {
    where.subcategory = { not_in: subcategoryIds };
  }

  const result = await payload.find({
    collection: "products",
    where,
    // Порядок обязан быть строго детерминированным: у большинства товаров
    // order одинаковый, и без уникального довеска Mongo вернул бы соседние
    // страницы с пересечениями — в бесконечной ленте это дубли и пропуски.
    sort: ["order", "id"],
    limit: CATALOG_PAGE_SIZE,
    page: page + 1,
    depth: 0,
    select: CARD_SELECT,
  });

  const docs = result.docs as unknown as CardDoc[];
  const images = await fetchCardImages(docs);

  return docs.map((doc) => toCardProduct(doc, images, categorySlug, groupKey));
}

/**
 * Ключ намеренно НЕ включает subcategoryIds: список подкатегорий влияет только
 * на состав группы «Другие», а любая правка подкатегории сбрасывает тег
 * "products" (см. revalidateSubcategories). Зато ключ не зависит от фильтра —
 * а значит, число записей кэша ограничено числом групп и страниц, сколько бы
 * комбинаций `?sub=` ни перебирали краулеры.
 */
const getCachedGroupPage = (args: GroupPageArgs) =>
  process.env.NODE_ENV === "development"
    ? () => fetchGroupPage(args)
    : unstable_cache(
        () => fetchGroupPage(args),
        [`catalog-page-${args.categoryId}-${args.groupKey}-${args.page}`],
        { tags: ["products"], revalidate: false },
      );

// ─── Сборка порции ───────────────────────────────────────────────────────────

interface CatalogChunkArgs {
  structure: CatalogStructure;
  groups: CatalogGroup[];
  cursor: CatalogCursor;
}

/**
 * Собирает порцию товаров начиная с позиции курсора. Порция набирается ЦЕЛЫМИ
 * страницами групп — так каждый запрос к БД совпадает с записью кэша, ничего
 * не читается «в стол». Мелкие группы склеиваются в один ответ, чтобы лента не
 * дёргалась по три товара за раз.
 */
export async function getCatalogChunk({
  structure,
  groups,
  cursor,
}: CatalogChunkArgs): Promise<CatalogChunk> {
  const subcategoryIds = structure.subcategories.map(
    (subcategory) => subcategory.id,
  );

  const items: CatalogCardProduct[] = [];
  let current: CatalogCursor | null = isValidCursor(groups, cursor)
    ? cursor
    : null;

  for (
    let fetches = 0;
    current && fetches < MAX_PAGE_FETCHES_PER_CHUNK;
    fetches++
  ) {
    const group = groups[current.group];

    const page = await getCachedGroupPage({
      categoryId: structure.category.id,
      categorySlug: structure.category.slug,
      groupKey: group.key,
      page: current.page,
      subcategoryIds,
    })();

    items.push(...page);
    current = advanceCursor(groups, current);

    if (items.length >= CATALOG_PAGE_SIZE) break;
  }

  return { items, cursor: current };
}
