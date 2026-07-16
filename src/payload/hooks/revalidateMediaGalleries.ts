import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

export const revalidateMediaGalleriesAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
}) => {
  const tags = new Set<string>(["media-galleries"]);
  if (doc?.key) tags.add(`media-gallery-${doc.key}`);
  // Ключ можно переименовать — сбрасываем и кэш под старым ключом.
  if (previousDoc?.key && previousDoc.key !== doc?.key) {
    tags.add(`media-gallery-${previousDoc.key}`);
  }
  await revalidateTags(tags);
  return doc;
};

export const revalidateMediaGalleriesAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  const tags = new Set<string>(["media-galleries"]);
  if (doc?.key) tags.add(`media-gallery-${doc.key}`);
  await revalidateTags(tags);
  return doc;
};
