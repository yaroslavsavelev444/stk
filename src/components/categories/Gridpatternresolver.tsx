/**
 * GridPatternResolver
 * Data-driven card size resolver. Computes card dimensions based on:
 *   - title character length
 *   - presence/length of description
 *   - card position in the grid
 *   - total number of categories
 *
 * This replaces the naive `index % GRID_PATTERNS.length` approach with
 * a system that assigns sizes intentionally, so the grid reads as a
 * designed composition rather than a random tiling.
 */

export type CardSize =
  | 'hero'        // col-span-8, row-span-2  — very wide, very tall
  | 'wide-tall'   // col-span-6, row-span-2  — wide and tall
  | 'wide'        // col-span-8, row-span-1  — full-width strip
  | 'medium-tall' // col-span-4, row-span-2  — square-ish tall
  | 'medium'      // col-span-4, row-span-1  — standard card
  | 'narrow-tall' // col-span-3, row-span-2  — tall narrow accent
  | 'narrow'      // col-span-3, row-span-1  — compact accent
  | 'square'      // col-span-6, row-span-2  — large square
  | 'half-wide'   // col-span-6, row-span-1  — half-width strip

export interface CardPattern {
  size: CardSize
  colClass: string       // Tailwind lg: column span
  rowClass: string       // Tailwind lg: row span
  aspectClass: string    // Fallback aspect ratio for non-lg
  textSizeClass: string  // Title font size tuned to card size
  minHeight: string      // min-height for the card on mobile
}

const SIZE_MAP: Record<CardSize, Omit<CardPattern, 'size'>> = {
  hero: {
    colClass: 'lg:col-span-8',
    rowClass: 'lg:row-span-2',
    aspectClass: 'aspect-[16/10]',        // чуть выше
    textSizeClass: 'text-3xl md:text-4xl lg:text-5xl',
    minHeight: '280px',
  },
  'wide-tall': {
    colClass: 'lg:col-span-6',
    rowClass: 'lg:row-span-2',
    aspectClass: 'aspect-[4/3]',
    textSizeClass: 'text-2xl md:text-3xl lg:text-4xl',
    minHeight: '260px',
  },
  wide: {
    colClass: 'lg:col-span-8',
    rowClass: 'lg:row-span-1',
    aspectClass: 'aspect-[21/9]',
    textSizeClass: 'text-2xl md:text-3xl',
    minHeight: '220px',
  },
  'medium-tall': {
    colClass: 'lg:col-span-4',
    rowClass: 'lg:row-span-2',
    aspectClass: 'aspect-[3/4]',
    textSizeClass: 'text-2xl md:text-3xl',
    minHeight: '290px',
  },
  medium: {
    colClass: 'lg:col-span-4',
    rowClass: 'lg:row-span-1',
    aspectClass: 'aspect-[4/3]',
    textSizeClass: 'text-xl md:text-2xl',
    minHeight: '220px',
  },
  'narrow-tall': {
    colClass: 'lg:col-span-3',
    rowClass: 'lg:row-span-2',
    aspectClass: 'aspect-[3/4]',
    textSizeClass: 'text-xl md:text-2xl',
    minHeight: '270px',
  },
  narrow: {
    colClass: 'lg:col-span-3',
    rowClass: 'lg:row-span-1',
    aspectClass: 'aspect-[4/3]',
    textSizeClass: 'text-lg md:text-xl',
    minHeight: '200px',
  },
  square: {
    colClass: 'lg:col-span-6',
    rowClass: 'lg:row-span-2',
    aspectClass: 'aspect-square',
    textSizeClass: 'text-2xl md:text-3xl lg:text-4xl',
    minHeight: '290px',
  },
  'half-wide': {
    colClass: 'lg:col-span-6',
    rowClass: 'lg:row-span-1',
    aspectClass: 'aspect-[16/9]',
    textSizeClass: 'text-xl md:text-2xl lg:text-3xl',
    minHeight: '220px',
  },
}

/**
 * Returns the minimum card width (in 12-col units) needed to
 * comfortably display a title of the given character length.
 *
 * Rough heuristic: at ~lg font-size each character needs ~18–22px.
 * A 12-col grid at 1280px is ~1216px wide, so each col-unit ~101px.
 *
 *   short  (≤12 chars)  → 3 cols  (~300px) is enough
 *   medium (13–20 chars) → 4 cols  (~400px)
 *   long   (21–32 chars) → 6 cols  (~600px)
 *   very long (>32 chars) → 8 cols  (~800px)
 */
function titleWidthScore(title: string): 3 | 4 | 6 | 8 {
  const len = title.length
  if (len <= 12) return 3
  if (len <= 20) return 4
  if (len <= 32) return 6
  return 8
}

/**
 * Semantic layout sequences for common category counts.
 * Each tuple is [CardSize for index 0, index 1, …].
 * Designed so columns sum to 12 on every visual row.
 *
 * Rules encoded here:
 *   - First card is always large (hero or wide-tall)
 *   - Mix of sizes to create visual rhythm
 *   - No two identical adjacent sizes on lg
 */
const COMPOSITION_SEQUENCES: Record<number, CardSize[]> = {
  1:  ['hero'],
  2:  ['wide-tall', 'wide-tall'],
  3:  ['hero',       'medium', 'medium'],
  4:  ['hero',       'medium', 'medium', 'wide'],
  5:  ['hero',       'medium', 'medium', 'half-wide', 'half-wide'],
  6:  ['hero',       'medium', 'medium', 'medium-tall', 'half-wide', 'medium'],
  7:  ['wide-tall',  'medium-tall', 'medium', 'medium', 'half-wide', 'medium', 'narrow'],
  8:  ['wide-tall',  'medium-tall', 'medium', 'medium', 'wide', 'narrow', 'narrow', 'half-wide'],
  9:  ['hero',       'medium', 'medium', 'medium', 'medium-tall', 'half-wide', 'narrow', 'narrow', 'medium'],
  10: ['hero',       'medium', 'medium', 'medium', 'medium-tall', 'half-wide', 'narrow', 'narrow', 'medium', 'wide'],
}

/**
 * For counts beyond what the sequences table covers, use a repeating
 * base rhythm of [medium-tall, medium, medium, half-wide, half-wide, medium, medium, wide].
 * 4+4+4 = 12 on row 1; 6+6 = 12 on row 2; 4+4+4 = 12 on row 3; 8 = first col row 4…
 * The rhythm tiles naturally.
 */
const REPEATING_RHYTHM: CardSize[] = [
  'medium-tall', 'medium', 'medium',
  'half-wide', 'half-wide',
  'medium', 'medium', 'wide',
]

/**
 * Bump a size up to the next wider option when the title is too long
 * for the originally assigned slot.
 */
function widenSize(size: CardSize, needed: 3 | 4 | 6 | 8): CardSize {
  const widths: Record<CardSize, number> = {
    narrow:       3,
    'narrow-tall': 3,
    medium:       4,
    'medium-tall': 4,
    'half-wide':  6,
    'wide-tall':  6,
    square:       6,
    wide:         8,
    hero:         8,
  }
  const heightIsDouble: Record<CardSize, boolean> = {
    narrow:       false,
    'narrow-tall': true,
    medium:       false,
    'medium-tall': true,
    'half-wide':  false,
    'wide-tall':  true,
    square:       true,
    wide:         false,
    hero:         true,
  }

  if (widths[size] >= needed) return size

  // Promote to the narrowest size that meets the width requirement,
  // preserving row-span preference where possible.
  const tall = heightIsDouble[size]
  if (needed <= 4) return tall ? 'medium-tall' : 'medium'
  if (needed <= 6) return tall ? 'wide-tall'   : 'half-wide'
  return tall ? 'hero' : 'wide'
}

export interface ResolvedCard {
  pattern: CardPattern
  /** Mobile col class */
  mobileColClass: string
  /** All classes for the grid item wrapper */
  gridClasses: string
  /** sizes attr for <Image> */
  imageSizes: string
  /** loading strategy */
  imageLoading: 'eager' | 'lazy'
}

export function resolveCards(categories: Array<{ name: string; description?: string | null }>) {
  const total = categories.length

  return categories.map((cat, index) => {
    const sequence = COMPOSITION_SEQUENCES[total]
    let baseSize: CardSize = sequence
      ? sequence[index]
      : REPEATING_RHYTHM[index % REPEATING_RHYTHM.length]

    const needed = titleWidthScore(cat.name)
    const size = widenSize(baseSize, needed)

    const props = SIZE_MAP[size]
    const pattern: CardPattern = { size, ...props }

    // Мобильная/планшетная раскладка
    const mobileColClass = 'col-span-12 md:col-span-6 lg:col-span-1' // lg: будет перебит colClass

    const gridClasses = [
      mobileColClass,
      pattern.colClass,
      pattern.rowClass,
      // aspectClass только до lg
      'lg:aspect-auto',
      pattern.aspectClass,
      `min-h-[${pattern.minHeight}]`,   // ← важный якорь
    ].join(' ')

    // sizes hint
    const lgWidth = parseInt(pattern.colClass.replace('lg:col-span-', '') || '4', 10)
    const lgPercent = Math.round((lgWidth / 12) * 100)

    const imageSizes = [
      '(max-width: 767px) 100vw',
      '(max-width: 1023px) 50vw',
      `${lgPercent}vw`,
    ].join(', ')

    const imageLoading: 'eager' | 'lazy' = index < 2 ? 'eager' : 'lazy'

    return { pattern, mobileColClass, gridClasses, imageSizes, imageLoading }
  })
}