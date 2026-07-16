import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

// Media встраивается (depth >= 1) в Categories, Products, Settings,
// MediaGalleries и в новый редакторский контент главной/страницы "О нас" —
// поэтому замена файла или alt-текста должна сбрасывать кэш везде, где
// изображение могло быть показано, а не только в самой коллекции Media.
const EMBEDDING_TAGS = [
  "categories",
  "products",
  "settings",
  "media-galleries",
  "home-content",
  "about-content",
];

export const revalidateMediaAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  const tags = new Set<string>(EMBEDDING_TAGS);
  if (doc?.type) tags.add(`media-${doc.type}`);
  if (previousDoc?.type && previousDoc.type !== doc?.type) {
    tags.add(`media-${previousDoc.type}`);
  }
  await revalidateTags(tags);
  return doc;
};

export const revalidateMediaAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  const tags = new Set<string>(EMBEDDING_TAGS);
  if (doc?.type) tags.add(`media-${doc.type}`);
  await revalidateTags(tags);
  return doc;
};
