import type { CartesianOffset, PolarPosition } from './types'

/**
 * Geometry engine for the radial contact layout.
 *
 * Every numeric tuning knob is a named constant below — nothing is
 * hardcoded inline, and nothing is looked up from a per-count table.
 * Angle/radius for any item count is derived from continuous functions,
 * so behavior is well-defined for 1, 2, 9, 50, or any other count
 * (the caller is expected to cap the count via MAX_VISIBLE_CONTACTS
 * before calling into this module — see useFloatingContacts.ts).
 */

/** Screen-space angle (degrees) the sector is centered on: up-left, per spec. */
export const SECTOR_CENTER_ANGLE_DEG = 135

/** Sector width (degrees) used when there is exactly one item — a single fixed direction. */
export const SINGLE_ITEM_SECTOR_DEG = 0

/** Sector width (degrees) for the smallest multi-item case (2 items): a tight arc. */
export const MIN_SECTOR_DEG = 90

/** Upper bound on sector width (degrees). Kept below 360 so the arc never closes onto itself. */
export const MAX_SECTOR_DEG = 300

/**
 * Degrees of additional sector width contributed by each item beyond the second.
 * Combined with MIN_SECTOR_DEG and clamped by MAX_SECTOR_DEG, this is what makes
 * "2-5 → polukrug, 6-8 → wide sector, 9+ → almost full circle" an emergent
 * property of a single formula rather than bucketed constants.
 */
export const SECTOR_GROWTH_PER_ITEM_DEG = 27

/** Base radial distance (px) from the main button center to a child item, at low item counts. */
export const BASE_RADIUS_PX = 92

/** Additional radial distance (px) contributed per item beyond the fourth, to ease crowding at high counts. */
export const RADIUS_GROWTH_PER_ITEM_PX = 6

/** Upper bound on radius growth (px) so dense menus don't sprawl off-screen. */
export const MAX_RADIUS_GROWTH_PX = 48

/** Item count above which radius growth begins (items 1..4 all share BASE_RADIUS_PX). */
const RADIUS_GROWTH_START_COUNT = 4

/**
 * Computes the angular sector [startAngle, endAngle] (degrees) for `count` items,
 * centered on SECTOR_CENTER_ANGLE_DEG.
 *
 * count <= 0 returns a zero-width sector at the center angle (caller should not
 * render anything for count 0; this keeps the function total/safe regardless).
 */
export function computeSector(count: number): { startDeg: number; endDeg: number; widthDeg: number } {
  const safeCount = Math.max(0, Math.floor(count))

  let widthDeg: number
  if (safeCount <= 1) {
    widthDeg = SINGLE_ITEM_SECTOR_DEG
  } else {
    const grown = MIN_SECTOR_DEG + (safeCount - 2) * SECTOR_GROWTH_PER_ITEM_DEG
    widthDeg = Math.min(MAX_SECTOR_DEG, grown)
  }

  return {
    startDeg: SECTOR_CENTER_ANGLE_DEG - widthDeg / 2,
    endDeg: SECTOR_CENTER_ANGLE_DEG + widthDeg / 2,
    widthDeg,
  }
}

/**
 * Computes the radius (px) used for a given item count. Grows mildly past
 * RADIUS_GROWTH_START_COUNT to reduce visual crowding when the angular step
 * between items gets small, capped at MAX_RADIUS_GROWTH_PX.
 */
export function computeRadius(count: number): number {
  const safeCount = Math.max(0, Math.floor(count))
  const itemsPastThreshold = Math.max(0, safeCount - RADIUS_GROWTH_START_COUNT)
  const growth = Math.min(MAX_RADIUS_GROWTH_PX, itemsPastThreshold * RADIUS_GROWTH_PER_ITEM_PX)
  return BASE_RADIUS_PX + growth
}

/**
 * Computes the polar position (angle + radius) for the item at `index`
 * (0-based) out of `count` total items.
 *
 * For count === 1, the single item sits exactly at SECTOR_CENTER_ANGLE_DEG.
 * For count > 1, items are evenly distributed across the computed sector,
 * inclusive of both endpoints (so the first and last items sit exactly on
 * the sector boundary — this matches "полукруг"/"широкий сектор" reading
 * naturally rather than leaving a half-step gap at each end).
 */
export function computeItemPolarPosition(index: number, count: number): PolarPosition {
  if (count <= 0) {
    return { angleDeg: SECTOR_CENTER_ANGLE_DEG, radius: 0 }
  }

  const radius = computeRadius(count)

  if (count === 1) {
    return { angleDeg: SECTOR_CENTER_ANGLE_DEG, radius }
  }

  const { startDeg, widthDeg } = computeSector(count)
  const step = widthDeg / (count - 1)
  const angleDeg = startDeg + step * index

  return { angleDeg, radius }
}

/**
 * Converts a screen-space polar position (0° = right, 90° = up, CCW) into a
 * Cartesian pixel offset suitable for a CSS transform, where +x is right and
 * +y is DOWN (standard screen/CSS convention). This is why the y component
 * negates the trigonometric sine.
 */
export function polarToCartesian(position: PolarPosition): CartesianOffset {
  const angleRad = (position.angleDeg * Math.PI) / 180
  return {
    x: position.radius * Math.cos(angleRad),
    y: -position.radius * Math.sin(angleRad),
  }
}

/** Convenience: angle+radius for item `index`/`count`, directly as a CSS-ready Cartesian offset. */
export function computeItemOffset(index: number, count: number): CartesianOffset {
  return polarToCartesian(computeItemPolarPosition(index, count))
}
