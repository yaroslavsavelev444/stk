// src/components/media-gallery/IMediaGalleryItem.tsx
import Image from "next/image";
import { ImagePlaceholder } from "@/components/UI/ImagePlaceholder";
import { IMediaGalleryItem } from "../types";

interface IMediaGalleryItemProps {
  item: IMediaGalleryItem;
  aspect?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  /** 'contain' — для сканов/скриншотов (сертификаты, отзывы), 'cover' — для фото. */
  fit?: "cover" | "contain";
  /** Вызывается при клике по элементу (например, для открытия лайтбокса). */
  onItemClick?: () => void;
}

export function MediaGalleryItem({
  item,
  aspect = "aspect-[3/4]",
  sizes = "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px",
  loading = "lazy",
  fit = "contain",
  onItemClick,
}: IMediaGalleryItemProps) {
  if (!item.imageUrl) {
    return <ImagePlaceholder alt={item.alt} aspect={aspect} />;
  }

  return (
    <div
      role={onItemClick ? "button" : undefined}
      tabIndex={onItemClick ? 0 : undefined}
      onClick={onItemClick}
      onKeyDown={
        onItemClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onItemClick();
              }
            }
          : undefined
      }
      className={`relative w-full overflow-hidden ${aspect} ${
        onItemClick ? "cursor-pointer" : ""
      }`}
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <Image
        src={item.imageUrl}
        alt={item.alt}
        fill
        sizes={sizes}
        loading={loading}
        className={fit === "cover" ? "object-cover" : "object-contain p-3"}
      />
    </div>
  );
}
