// src/components/media-gallery/MediaGalleryCarousel.tsx
import { Carousel, CarouselSlide } from "@/components/UI/Carousel";
import { IMediaGalleryItem } from "../types";
import { MediaGalleryItem } from "./MediaGalleryItem";

interface MediaGalleryCarouselProps {
  items: IMediaGalleryItem[];
  aspect?: string;
  fit?: "cover" | "contain";
  slideWidthClassName?: string;
}

/**
 * Переиспользует существующий `Carousel`/`CarouselSlide` (тот же, что
 * используется в AboutCertificates на странице «О нас») — своей
 * реализации карусели здесь нет.
 */
export function MediaGalleryCarousel({
  items,
  aspect = "aspect-[4/3]",
  fit = "contain",
  slideWidthClassName = "w-[260px] sm:w-[300px]",
}: MediaGalleryCarouselProps) {
  return (
    <Carousel
      showArrows
      showDots
      loop={false}
      containerClassName="flex gap-4"
      viewportClassName="-mx-4 px-4 sm:mx-0 sm:px-0"
      className="pb-2"
    >
      {items.map((item) => (
        <CarouselSlide key={item.id} className={slideWidthClassName}>
          <MediaGalleryItem item={item} aspect={aspect} fit={fit} />
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
