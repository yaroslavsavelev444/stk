import type { Product, Subcategory } from "@/payload-types";
import type { ProductGroup } from "./ProductsBySubcategory";

function getSubcategoryId(product: Product): string | null {
  const sub = product.subcategory;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

interface GroupProductsArgs {
  products: Product[];
  subcategories: Subcategory[];
  /** id подкатегорий в порядке, в котором их выбрал пользователь (пусто = фильтр не активен). */
  selectedIds: string[];
}

interface GroupProductsResult {
  groups: ProductGroup[];
  /** Товары без подкатегории (или чья подкатегория больше не опубликована) — только когда фильтр не активен. */
  ungrouped: Product[];
  /** Итоговый список товаров с учётом фильтра — для подсчёта totalDocs/пустого состояния. */
  visibleProducts: Product[];
}

/**
 * Группирует уже загруженные товары категории по подкатегориям.
 *
 * Без активного фильтра — группы идут в порядке поля `order` подкатегории,
 * товары без подкатегории попадают в "Другие товары" в конце.
 *
 * С активным фильтром (выбраны конкретные подкатегории) — группы идут в
 * порядке, в котором пользователь их выбирал (selectedIds), а товары без
 * подкатегории не показываются вовсе — раз пользователь явно отфильтровал.
 */
export function groupProductsBySubcategory({
  products,
  subcategories,
  selectedIds,
}: GroupProductsArgs): GroupProductsResult {
  const hasFilter = selectedIds.length > 0;

  const visibleProducts = hasFilter
    ? products.filter((product) => selectedIds.includes(getSubcategoryId(product) ?? ""))
    : products;

  const orderedIds = hasFilter ? selectedIds : subcategories.map((s) => s.id);

  const groups: ProductGroup[] = [];
  for (const id of orderedIds) {
    const subcategory = subcategories.find((s) => s.id === id);
    if (!subcategory) continue;
    const items = visibleProducts.filter((product) => getSubcategoryId(product) === id);
    if (items.length === 0) continue;
    groups.push({ subcategory, items });
  }

  const groupedIds = new Set(groups.map((g) => g.subcategory.id));
  const ungrouped = hasFilter
    ? []
    : visibleProducts.filter((product) => {
        const id = getSubcategoryId(product);
        return !id || !groupedIds.has(id);
      });

  return { groups, ungrouped, visibleProducts };
}
