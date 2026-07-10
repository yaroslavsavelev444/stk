import type { Media } from "@/payload-types";
import type { IMediaGallery, IMediaGalleryItem } from "../types";

interface RawGalleryItem {
  id?: string | null;
  image: string | Media;
  caption?: string | null;
}

interface RawMediaGallery {
  key: string;
  title?: string | null;
  description?: string | null;
  items?: RawGalleryItem[] | null;
}

/** Тот же паттерн резолва URL, что и в CategoryCard/ProductCard. */
function resolveImageUrl(image: string | Media): string | null {
  if (typeof image !== "object" || image === null || !image.url) return null;
  try {
    return new URL(image.url, "http://localhost").pathname;
  } catch {
    return null;
  }
}

/**
 * Нормализует сырой документ `media-galleries` в доменный IMediaGallery.
 * Элементы без разрешённого изображения (например, media ещё не подгружен
 * из-за depth) отфильтровываются — UI никогда не получает "битых" карточек.
 */
export function mapMediaGallery(
  raw: RawMediaGallery | null | undefined,
): IMediaGallery | null {
  if (!raw) return null;

  const items: IMediaGalleryItem[] = (raw.items ?? [])
    .map((item, index): IMediaGalleryItem | null => {
      const imageUrl = resolveImageUrl(item.image);
      if (!imageUrl) return null;

      const media = typeof item.image === "object" ? item.image : null;
      return {
        id: item.id ?? `${raw.key}-${index}`,
        imageUrl,
        alt: item.caption || media?.alt || raw.title || raw.key,
      };
    })
    .filter((item): item is IMediaGalleryItem => item !== null);

  return {
    key: raw.key,
    title: raw.title,
    description: raw.description,
    items,
  };
}
