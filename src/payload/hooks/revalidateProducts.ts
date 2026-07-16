import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

export const revalidateProductsAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateTags(["products"]);
  return doc;
};

export const revalidateProductsAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateTags(["products"]);
  return doc;
};
