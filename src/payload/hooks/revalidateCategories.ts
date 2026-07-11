import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

export const revalidateCategoriesAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag("categories", { expire: 0 });
  return doc;
};

export const revalidateCategoriesAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateTag("categories", { expire: 0 });
  return doc;
};
