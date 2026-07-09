"use client";

import { Carousel, CarouselSlide } from "@/components/UI/Carousel";
import { IMediaGalleryItem } from "../types";
import { MediaGalleryItem } from "./MediaGalleryItem";

interface MediaGalleryCarouselProps {
  items: IMediaGalleryItem[];
  aspect?: string;
  fit?: "cover" | "contain";
  slideWidthClassName?: string;
  onItemClick?: (index: number) => void;
}

export function MediaGalleryCarousel({
  items,
  aspect = "aspect-[4/3]",
  fit = "contain",
  slideWidthClassName = "w-[260px] sm:w-[300px]",
  onItemClick,
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
      {items.map((item, index) => (
        <CarouselSlide key={item.id} className={slideWidthClassName}>
          <MediaGalleryItem
            item={item}
            aspect={aspect}
            fit={fit}
            onItemClick={() => onItemClick?.(index)}
          />
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
