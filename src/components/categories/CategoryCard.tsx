import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/payload-types'
import type { CardPattern } from './Gridpatternresolver'

interface CategoryCardProps {
  category: Category
  pattern: CardPattern
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
}

/**
 * CategoryImage
 * Renders the background image layer. Falls back to a branded gradient
 * that looks intentional even without a photo.
 */
function CategoryImage({
  url,
  alt,
  sizes,
  loading,
}: {
  url: string | null
  alt: string
  sizes: string
  loading: 'lazy' | 'eager'
}) {
  if (url) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
        sizes={sizes}
        loading={loading}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjQyMjZGIi8+PC9zdmc+"
      />
    )
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg,
          var(--primary) 0%,
          color-mix(in srgb, var(--primary) 60%, #000) 60%,
          color-mix(in srgb, var(--accent) 40%, #000) 100%
        )`,
      }}
      aria-hidden="true"
    />
  )
}

/**
 * CategoryOverlay
 * Multi-layer overlay system that adapts to image brightness.
 * Creates visual depth without heavy shadows.
 */
function CategoryOverlay() {
  return (
    <>
      {/* Base darkening layer — ensures text legibility on any photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.04) 100%)' }}
        aria-hidden="true"
      />

      {/* Side vignette — adds depth and frames the content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.22) 0%, transparent 50%)' }}
        aria-hidden="true"
      />

      {/* Hover reveal layer — a subtle tinted lift on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to top, rgba(46,45,143,0.38) 0%, transparent 60%)' }}
        aria-hidden="true"
      />
    </>
  )
}

/**
 * CategoryMeta
 * Small decorative top-left badge showing the "category" label.
 * Acts as a brand anchor and makes the card feel editorial.
 */
function CategoryMeta() {
  return (
    <div className="absolute top-4 left-4 z-10">
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-white/60 transition-colors duration-300 group-hover:text-white/80"
      >
        <span
          className="inline-block w-3.5 h-px bg-white/40 transition-all duration-300 group-hover:w-5 group-hover:bg-white/70"
          aria-hidden="true"
        />
        Каталог
      </span>
    </div>
  )
}

/**
 * CategoryContent
 * The primary text layer. Title is always visible; description slides
 * up on hover with a measured easing curve.
 */
function CategoryContent({
  name,
  description,
  textSizeClass,
}: {
  name: string
  description?: string | null
  textSizeClass: string
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-6">
      {/* Title */}
      <h3
        className={`
          font-bold leading-[1.15] tracking-[-0.02em] text-white
          transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          ${description ? 'group-hover:-translate-y-1' : ''}
          ${textSizeClass}
        `}
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}
      >
        {name}
      </h3>

      {/* Description — slides up from below, no line-clamp */}
      {description && (
        <div
          className="overflow-hidden"
          aria-hidden="false"
        >
          <p
            className="mt-2 text-sm leading-relaxed text-white/75
              opacity-0 translate-y-3
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-500 delay-75 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            {description}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * CategoryHoverLayer
 * Decorative arrow indicator that appears on hover.
 * Signals interactivity without cluttering the resting state.
 */
function CategoryHoverLayer() {
  return (
    <div
      className="absolute top-4 right-4 z-10
        opacity-0 translate-x-1 -translate-y-1
        group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
        transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
      aria-hidden="true"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.22)',
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 10.5L10.5 3.5M10.5 3.5H5.5M10.5 3.5V8.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

/**
 * CategoryCard
 * The top-level card component. Delegates rendering to focused sub-components.
 * Business logic (links, image resolution, SEO) is preserved exactly from the
 * original implementation.
 */
export function CategoryCard({
  category,
  pattern,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
}: CategoryCardProps) {
  // НЕ МЕНЯТЬ: безопасная проверка типа image
  const media =
    typeof category.image === 'object' ? category.image : null

  // НЕ МЕНЯТЬ: разрешение URL
  const imageUrl = media?.url ? new URL(media.url).pathname : null
  const altText = media?.alt || category.name || 'Категория'

  return (
    <Link
      href={`/catalog/${category.slug}`}
      aria-label={`Открыть категорию ${category.name}`}
      prefetch={false}
      className={`
        group relative block overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]
        isolate
        ${className}
      `}
      style={{ borderRadius: 'var(--radius-xl)' }}
    >
      {/* Layer 1 — Background image or fallback gradient */}
      <CategoryImage
        url={imageUrl}
        alt={altText}
        sizes={sizes}
        loading={loading}
      />

      {/* Layer 2 — Multi-stop overlays for depth and legibility */}
      <CategoryOverlay />

      {/* Layer 3 — Meta badge (top-left) */}
      <CategoryMeta />

      {/* Layer 4 — Hover arrow indicator (top-right) */}
      <CategoryHoverLayer />

      {/* Layer 5 — Primary text content (bottom) */}
      <CategoryContent
        name={category.name}
        description={category.description}
        textSizeClass={pattern.textSizeClass}
      />
    </Link>
  )
}