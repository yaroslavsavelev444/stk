"use client";

import { createContext, useContext } from "react";
import type { CarouselContextType } from "./types";

export const CarouselContext = createContext<CarouselContextType | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel> component.");
  }
  return context;
}
