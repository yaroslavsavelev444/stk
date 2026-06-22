import type { ContactType } from './types'

const ABSOLUTE_URL_PATTERN = /^(https?:)?\/\//i

interface ContactIconProps {
  /** Raw icon value from CMS: a FontAwesome class string, an absolute image URL, or empty. */
  icon: string
  type: ContactType
  /** Pixel size for the rendered icon (width === height). */
  sizePx: number
  className?: string
}

/**
 * Default inline SVGs used when the CMS `icon` field is empty. Kept minimal
 * and stroke-based so they inherit `currentColor` and need no external
 * icon-font/network dependency. One per supported ContactType, plus the
 * overflow ("all contacts") glyph used by FloatingContactItem for the
 * synthetic overflow entry.
 */
function FallbackGlyph({ type, sizePx }: { type: ContactType; sizePx: number }) {
  const common = {
    width: sizePx,
    height: sizePx,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (type) {
    case 'phone':
      return (
        <svg {...common}>
          <path d="M5 4h3.2l1.6 4.4-2 1.6a12 12 0 0 0 6.2 6.2l1.6-2 4.4 1.6V19a2 2 0 0 1-2 2C10.6 21 3 13.4 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      )
    case 'email':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M7 17 4 20l1-3.3A8 8 0 1 1 12 20a8 8 0 0 1-5-1.7Z" />
          <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l.7-1.6c.1-.3.5-.4.8-.2l1.7 1" />
        </svg>
      )
    case 'telegram':
      return (
        <svg {...common}>
          <path d="m21 4-9 17-2-7-7-2Z" />
          <path d="M21 4 10 14" />
        </svg>
      )
    case 'link':
      return (
        <svg {...common}>
          <path d="M9 15 15 9" />
          <path d="M11 6.5 12.6 5a3.5 3.5 0 0 1 5 5L16 11.5" />
          <path d="M13 17.5 11.4 19a3.5 3.5 0 0 1-5-5L8 12.5" />
        </svg>
      )
    case 'text':
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      )
  }
}

export function OverflowGlyph({ sizePx }: { sizePx: number }) {
  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  )
}

function isFontAwesomeClass(icon: string): boolean {
  return /(^|\s)fa-/.test(icon)
}

/**
 * Renders a contact's icon:
 * - Absolute URL → <img>.
 * - FontAwesome class string (e.g. "fa-solid fa-phone") → <i> with that class;
 *   assumes the FA stylesheet is already loaded globally by the host app
 *   (Settings.ts labels this field "Иконка (FontAwesome класс или URL)").
 * - Empty/unrecognized → type-based fallback SVG, so the button is never blank.
 */
export function ContactIcon({ icon, type, sizePx, className }: ContactIconProps) {
  const trimmed = icon.trim()

  if (trimmed.length === 0) {
    return <FallbackGlyph type={type} sizePx={sizePx} />
  }

  if (ABSOLUTE_URL_PATTERN.test(trimmed)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- icon source is CMS-controlled, arbitrary remote host
      <img
        src={trimmed}
        alt=""
        width={sizePx}
        height={sizePx}
        className={className}
        style={{ width: sizePx, height: sizePx, objectFit: 'contain' }}
      />
    )
  }

  if (isFontAwesomeClass(trimmed)) {
    return (
      <i
        className={trimmed}
        style={{ fontSize: sizePx * 0.78 }}
        aria-hidden="true"
      />
    )
  }

  return <FallbackGlyph type={type} sizePx={sizePx} />
}
