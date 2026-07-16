import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

// Категории встраиваются в товары через relationship (название и slug
// показываются в карточках товара и хлебных крошках), поэтому изменение
// категории должно сбрасывать и кэш товаров, а не только "categories".
export const revalidateCategoriesAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateTags(["categories", "products"]);
  return doc;
};

export const revalidateCategoriesAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateTags(["categories", "products"]);
  return doc;
};
