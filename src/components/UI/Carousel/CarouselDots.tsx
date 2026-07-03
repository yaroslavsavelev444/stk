"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { useCarousel } from "./CarouselContext";

interface CarouselDotsProps {
  className?: string;
  dotClassName?: string;
  activeDotClassName?: string;
}

export function CarouselDots({
  className,
  dotClassName,
  activeDotClassName,
}: CarouselDotsProps) {
  const { selectedIndex, scrollSnaps, emblaApi } = useCarousel();

  if (!emblaApi || scrollSnaps.length <= 1) return null;

  return (
    <div
      className={cn("flex items-center justify-center gap-2 mt-4", className)}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            index === selectedIndex
              ? "bg-[var(--text-primary)]"
              : "bg-[var(--border-primary)]",
            dotClassName,
            index === selectedIndex && activeDotClassName,
          )}
          onClick={() => emblaApi.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
