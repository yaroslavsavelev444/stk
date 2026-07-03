import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from "embla-carousel";
import type { AutoplayOptionsType } from "embla-carousel-autoplay";
import type { WheelGesturesPluginOptions } from "embla-carousel-wheel-gestures";

export interface CarouselProps {
  /** Стандартные опции Embla */
  options?: EmblaOptionsType;
  /** Дополнительные плагины */
  plugins?: EmblaPluginType[];
  /** Слайды (React-элементы) */
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
  containerClassName?: string;
  slideClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
  arrowPrevLabel?: string;
  arrowNextLabel?: string;
  dotsClassName?: string;
  /** Автопроигрывание: true или объект с настройками */
  autoplay?: boolean | AutoplayOptionsType;
  /** Управление колесом мыши: true или объект с настройками */
  wheelGestures?: boolean | WheelGesturesPluginOptions;
  loop?: boolean;
  align?: "start" | "center" | "end";
  /** Удобный шорткат для адаптивных брейкпоинтов (объект вида { '(min-width: 768px)': { align: 'start' } }).
   *  Если передан вместе с options.breakpoints, последние будут иметь приоритет. */
  slidesPerView?: number | Record<string, EmblaOptionsType>;
}

export interface CarouselContextType {
  emblaApi: EmblaCarouselType | undefined;
  selectedIndex: number;
  scrollSnaps: number[];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}
