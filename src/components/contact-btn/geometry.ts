import type { CartesianOffset, PolarPosition } from "./types";

/**
 * Центр дуги.
 *
 * 135 градусов:
 *
 *        |
 *        *
 *     *
 *  *
 *
 * Идеально подходит для кнопки справа снизу.
 */
export const SECTOR_CENTER_ANGLE_DEG = 140;

/**
 * Когда элементов мало — обычная компактная дуга.
 */
const SMALL_MENU_MAX_ITEMS = 3;

/**
 * Для большого количества используем полукруг.
 */
const LARGE_MENU_SECTOR_DEG = 140;

/**
 * Базовое расстояние.
 */
const BASE_RADIUS = 90;

/**
 * Минимальное расстояние.
 *
 * Чем больше элементов,
 * тем ближе они к кнопке.
 */
const MIN_RADIUS = 55;

export function computeRadius(count: number): number {
  if (count <= SMALL_MENU_MAX_ITEMS) {
    return BASE_RADIUS;
  }

  /**
   * Например:
   *
   * 5 элементов -> 80px
   * 6 элементов -> 70px
   * 7+ -> 55px
   */
  return Math.max(
    MIN_RADIUS,
    BASE_RADIUS - (count - SMALL_MENU_MAX_ITEMS) * 10,
  );
}

export function computeSector(count: number) {
  if (count <= 1) {
    return {
      startDeg: SECTOR_CENTER_ANGLE_DEG,
      endDeg: SECTOR_CENTER_ANGLE_DEG,
      widthDeg: 0,
    };
  }

  /**
   * Маленькое количество.
   *
   * Делаем компактный сектор.
   */
  if (count <= SMALL_MENU_MAX_ITEMS) {
    const width = 90;

    return {
      startDeg: SECTOR_CENTER_ANGLE_DEG - width / 2,

      endDeg: SECTOR_CENTER_ANGLE_DEG + width / 2,

      widthDeg: width,
    };
  }

  /**
   * Большое количество.
   *
   * Строго полукруг.
   *
   * От 45 до 225 градусов.
   */
  return {
    startDeg: SECTOR_CENTER_ANGLE_DEG - LARGE_MENU_SECTOR_DEG / 2,

    endDeg: SECTOR_CENTER_ANGLE_DEG + LARGE_MENU_SECTOR_DEG / 2,

    widthDeg: LARGE_MENU_SECTOR_DEG,
  };
}

export function computeItemPolarPosition(
  index: number,
  count: number,
): PolarPosition {
  const radius = computeRadius(count);

  if (count === 1) {
    return {
      angleDeg: SECTOR_CENTER_ANGLE_DEG,
      radius,
    };
  }

  const { startDeg, widthDeg } = computeSector(count);

  const step = widthDeg / (count - 1);

  return {
    angleDeg: startDeg + step * index,

    radius,
  };
}

export function polarToCartesian(position: PolarPosition): CartesianOffset {
  const angle = (position.angleDeg * Math.PI) / 180;

  return {
    x: position.radius * Math.cos(angle),

    y: -position.radius * Math.sin(angle),
  };
}

export function computeItemOffset(
  index: number,
  count: number,
): CartesianOffset {
  return polarToCartesian(computeItemPolarPosition(index, count));
}
