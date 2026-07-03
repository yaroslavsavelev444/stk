"use client";
import { cn } from "@/utils/cn";
import { useCarousel } from "./CarouselContext";

interface CarouselButtonsProps {
  className?: string;
  prevClassName?: string;
  nextClassName?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export function CarouselButtons({
  className,
  prevClassName,
  nextClassName,
  prevLabel = "Previous",
  nextLabel = "Next",
}: CarouselButtonsProps) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <div
      className={cn("flex items-center justify-center gap-2 mt-4", className)}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-full p-2 border border-[var(--border-primary)]",
          "text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          prevClassName,
        )}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label={prevLabel}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-full p-2 border border-[var(--border-primary)]",
          "text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          nextClassName,
        )}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label={nextLabel}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
