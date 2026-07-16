import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

export const revalidateConsentsAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateTags(["consents"]);
  return doc;
};

export const revalidateConsentsAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateTags(["consents"]);
  return doc;
};
