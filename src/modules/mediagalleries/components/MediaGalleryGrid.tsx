// src/components/media-gallery/MediaGalleryGrid.tsx
import { Reveal } from "@/components/UI/Reveal/Reveal";
import { IMediaGalleryItem } from "../types";
import { MediaGalleryItem } from "./MediaGalleryItem";

interface MediaGalleryGridProps {
  items: IMediaGalleryItem[];
  aspect?: string;
  fit?: "cover" | "contain";
  columnsClassName?: string;
}

/** Адаптивная сетка — сценарий "витрины" (сертификаты, документы и т.п.). */
export function MediaGalleryGrid({
  items,
  aspect = "aspect-[3/4]",
  fit = "contain",
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
}: MediaGalleryGridProps) {
  return (
    <div className={`grid ${columnsClassName} gap-3 md:gap-4`}>
      {items.map((item, index) => (
        <Reveal key={item.id} translateY={16} fillWidth delay={index * 0.05}>
          <MediaGalleryItem
            item={item}
            aspect={aspect}
            fit={fit}
            loading={index < 4 ? "eager" : "lazy"}
          />
        </Reveal>
      ))}
    </div>
  );
}
