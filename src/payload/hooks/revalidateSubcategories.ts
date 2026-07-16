import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

// Подкатегории встраиваются в товары через relationship (название показывается
// в фильтре и в заголовках групп на странице категории), поэтому изменение
// подкатегории должно сбрасывать и кэш товаров, а не только "subcategories".
export const revalidateSubcategoriesAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateTags(["subcategories", "products"]);
  return doc;
};

export const revalidateSubcategoriesAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateTags(["subcategories", "products"]);
  return doc;
};
