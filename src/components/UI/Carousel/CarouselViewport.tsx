"use client";
import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface CarouselViewportProps {
  className?: string;
  children: React.ReactNode;
}

export const CarouselViewport = forwardRef<
  HTMLDivElement,
  CarouselViewportProps
>(({ className, children }, ref) => (
  <div className={cn("overflow-hidden", className)} ref={ref}>
    {children}
  </div>
));
CarouselViewport.displayName = "CarouselViewport";
