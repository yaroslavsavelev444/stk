"use client";

import { Reveal } from "@/components/UI/Reveal/Reveal";
import { IMediaGalleryItem } from "../types";
import { MediaGalleryItem } from "./MediaGalleryItem";

interface MediaGalleryGridProps {
  items: IMediaGalleryItem[];
  aspect?: string;
  fit?: "cover" | "contain";
  columnsClassName?: string;
  onItemClick?: (index: number) => void;
}

export function MediaGalleryGrid({
  items,
  aspect = "aspect-[3/4]",
  fit = "contain",
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  onItemClick,
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
            onItemClick={() => onItemClick?.(index)}
          />
        </Reveal>
      ))}
    </div>
  );
}
