"use client";

import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import WheelGestures from "embla-carousel-wheel-gestures";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils/cn";
import { CarouselButtons } from "./CarouselButtons";
import { CarouselContext } from "./CarouselContext";
import { CarouselDots } from "./CarouselDots";
import type { CarouselProps } from "./types";

export function Carousel({
  options,
  plugins = [],
  children,
  className,
  viewportClassName,
  containerClassName,
  showArrows = false,
  showDots = false,
  autoplay,
  wheelGestures,
  loop,
  align,
  slidesPerView,
  ...restProps
}: CarouselProps & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  const mergedOptions = useMemo(() => {
    const opts: EmblaOptionsType = { ...options };
    if (loop !== undefined) opts.loop = loop;
    if (align) opts.align = align;
    if (slidesPerView && typeof slidesPerView !== "number") {
      opts.breakpoints = { ...(opts.breakpoints || {}), ...slidesPerView };
    }
    return opts;
  }, [options, loop, align, slidesPerView]);

  const pluginList = useMemo(() => {
    const extra: EmblaPluginType[] = [];
    if (autoplay) {
      const autoplayOptions = typeof autoplay === "object" ? autoplay : {};
      extra.push(Autoplay(autoplayOptions));
    }
    if (wheelGestures) {
      const wheelOptions =
        typeof wheelGestures === "object" ? wheelGestures : {};
      extra.push(WheelGestures(wheelOptions));
    }
    return [...plugins, ...extra];
  }, [autoplay, wheelGestures, plugins]);

  const [emblaRef, emblaApi] = useEmblaCarousel(mergedOptions, pluginList);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi, onInit, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const canScrollPrev = useMemo(() => {
    if (!emblaApi) return false;
    return loop ? true : emblaApi.canScrollPrev();
  }, [emblaApi, selectedIndex, loop]);

  const canScrollNext = useMemo(() => {
    if (!emblaApi) return false;
    return loop ? true : emblaApi.canScrollNext();
  }, [emblaApi, selectedIndex, loop]);

  const contextValue = useMemo(
    () => ({
      emblaApi,
      selectedIndex,
      scrollSnaps,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    }),
    [
      emblaApi,
      selectedIndex,
      scrollSnaps,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    ],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className={cn("carousel", className)} {...restProps}>
        <div
          className={cn("overflow-hidden", viewportClassName)}
          ref={emblaRef}
        >
          <div className={cn("flex", containerClassName)}>{children}</div>
        </div>
        {showArrows && <CarouselButtons />}
        {showDots && <CarouselDots />}
      </div>
    </CarouselContext.Provider>
  );
}
