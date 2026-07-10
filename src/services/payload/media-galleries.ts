// src/services/payload/media-galleries.ts
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import type { IMediaGallery } from "@/modules/mediagalleries/types";
import { mapMediaGallery } from "@/modules/mediagalleries/utils/mapMediaGallery";
import { getPayloadInstance } from "./getPayload";

async function fetchMediaGalleryByKey(
  key: string,
): Promise<IMediaGallery | null> {
  const payload = await getPayloadInstance();
  const where: Where = {
    key: { equals: key },
    isPublished: { equals: true },
  };

  const result = await payload.find({
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
