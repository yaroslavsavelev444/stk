// src/services/payload/media-galleries.ts
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import { mapMediaGallery } from "@/modules/mediagalleries/utils/mapMediaGallery";
import { MediaGallery } from "@/payload-types";
import { getPayloadInstance } from "./getPayload";

/**
 * NOTE: коллекция `media-galleries` типизируется после `pnpm generate:types`.
 * До регенерации `payload-types.ts` строковый литерал коллекции здесь
 * не входит в GeneratedTypes['collections'], поэтому вызов точечно кастуется —
 * это единственное место, где приходится обходить строгую типизацию.
 */
async function fetchMediaGalleryByKey(
  key: string,
): Promise<MediaGallery | null> {
  const payload = await getPayloadInstance();
  const where: Where = {
    key: { equals: key },
    isPublished: { equals: true },
  };

  const result = await (payload.find as any)({
    collection: "media-galleries",
    where,
    limit: 1,
    depth: 1,
  });

  return mapMediaGallery(result.docs[0]);
}

export const getCachedMediaGalleryByKey = (key: string) =>
  process.env.NODE_ENV === "development"
    ? () => fetchMediaGalleryByKey(key)
    : unstable_cache(
        () => fetchMediaGalleryByKey(key),
        [`media-gallery-${key}`],
        {
          tags: ["media-galleries", `media-gallery-${key}`],
          revalidate: false,
        },
      );
