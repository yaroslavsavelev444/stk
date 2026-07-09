"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import { IMediaGalleryItem } from "../types";
import { MediaGalleryCarousel } from "./MediaGalleryCarousel";
import { MediaGalleryGrid } from "./MediaGalleryGrid";

export type MediaGalleryVariant = "grid" | "carousel";

export interface MediaGalleryProps {
  items: IMediaGalleryItem[];
  variant?: MediaGalleryVariant;
  title?: string | null;
  description?: string | null;
  aspect?: string;
  fit?: "cover" | "contain";
  className?: string;
  gridColumnsClassName?: string;
  carouselSlideWidthClassName?: string;
}

export function MediaGallery({
  items,
  variant = "grid",
  title,
  description,
  aspect,
  fit,
  className = "",
  gridColumnsClassName,
  carouselSlideWidthClassName,
}: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // только элементы с изображением участвуют в лайтбоксе
  const validItems = items.filter((item) => item.imageUrl);
  const slides = validItems.map((item) => ({
    src: item.imageUrl!,
    alt: item.alt || "",
  }));

  const handleItemClick = (originalIndex: number) => {
    const clickedItem = items[originalIndex];
    if (!clickedItem?.imageUrl) return;
    const slideIndex = validItems.findIndex((v) => v.id === clickedItem.id);
    if (slideIndex !== -1) {
      setLightboxIndex(slideIndex);
      setLightboxOpen(true);
    }
  };

  if (items.length === 0) return null;

  return (
    <section className={`w-full ${className}`}>
      {(title || description) && (
        <Reveal translateY={16} fillWidth>
          <div className="mb-8 flex flex-col items-center gap-2 text-center md:mb-10">
            {title && (
              <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mx-auto max-w-xl text-[var(--text-secondary)]">
                {description}
              </p>
            )}
          </div>
        </Reveal>
      )}

      {variant === "carousel" ? (
        <MediaGalleryCarousel
          items={items}
          aspect={aspect}
          fit={fit}
          slideWidthClassName={carouselSlideWidthClassName}
          onItemClick={handleItemClick}
        />
      ) : (
        <MediaGalleryGrid
          items={items}
          aspect={aspect}
          fit={fit}
          columnsClassName={gridColumnsClassName}
          onItemClick={handleItemClick}
        />
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        on={{
          view: ({ index: currentIndex }) => setLightboxIndex(currentIndex),
        }}
      />
    </section>
  );
}
