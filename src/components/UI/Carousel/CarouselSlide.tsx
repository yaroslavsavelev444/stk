import React from "react";
import { cn } from "@/utils/cn";

interface CarouselSlideProps {
  className?: string;
  children: React.ReactNode;
}

export function CarouselSlide({ className, children }: CarouselSlideProps) {
  return <div className={cn("flex-shrink-0", className)}>{children}</div>;
}
