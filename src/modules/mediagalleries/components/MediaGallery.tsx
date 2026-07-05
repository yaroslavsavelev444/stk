// src/components/media-gallery/MediaGallery.tsx
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

/**
 * Единая точка входа для отображения любых медиа-подборок сайта.
 * Не знает о происхождении данных (Payload/CMS) — принимает уже
 * нормализованные IMediaGalleryItem[] и выбирает сценарий рендера
 * по `variant`, оставаясь при этом единственным местом, отвечающим
 * за заголовок/описание секции и общий отступ.
 *
 *  - 'grid'     — адаптивная сетка ("витрина": сертификаты и т.п.)
 *  - 'carousel' — переиспользует существующий UI/Carousel (отзывы и т.п.)
 *
 * Новый сценарий отображения добавляется здесь одной веткой — блокам
 * (CertificatesSection, ReviewsSection, ...) переписывать ничего не нужно.
 */
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
        />
      ) : (
        <MediaGalleryGrid
          items={items}
          aspect={aspect}
          fit={fit}
          columnsClassName={gridColumnsClassName}
        />
      )}
    </section>
  );
}
