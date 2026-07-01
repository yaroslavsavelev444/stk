import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/payload-types'

interface CategoryCardProps {
  category: Category
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
}

/**
 * CategoryBackdrop
 * Полнобличная фотослойка. object-cover гарантирует, что фото никогда не
 * растягивается и не сжимается — оно просто масштабируется и кропается так,
 * чтобы полностью покрыть площадь карточки (ровно как на референсе).
 * При отсутствии фото — брендовый градиент-заглушка, чтобы не было
 * пустого блока/скачка раскладки.
 */
function CategoryBackdrop({
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
        sizes={sizes}
        loading={loading}
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY3Ii8+PC9zdmc+"
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
 * CategoryFade
 * Градиент "surface → transparent", лежащий поверх верхней части фото.
 * Именно он создаёт эффект "фото выцветает в белый", благодаря которому
 * заголовок и описание всегда читаются на светлой подложке, а не поверх
 * произвольного по яркости/контрасту изображения.
 */
function CategoryFade() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
      style={{
        height: '64%',
        background: `linear-gradient(to bottom,
          var(--surface) 0%,
          var(--surface) 32%,
          color-mix(in srgb, var(--surface) 65%, transparent) 58%,
          transparent 100%
        )`,
      }}
      aria-hidden="true"
    />
  )
}

/**
 * CategoryContent
 * Заголовок + описание. Рендерятся поверх CategoryFade — поэтому
 * читаемость гарантирована независимо от содержимого фото под ними.
 */
function CategoryContent({
  name,
  description,
}: {
  name: string
  description?: string | null
}) {
  return (
    <div className="relative z-[2] flex flex-col gap-2 p-5 md:p-6">
      <h3 className="text-[1.15rem] md:text-[1.3rem] font-bold leading-snug tracking-[-0.01em] text-[var(--text-primary)]">
        {name}
      </h3>

      {description && (
        <p
          className="text-sm leading-relaxed text-[var(--text-secondary)]"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
      )}
    </div>
  )
}

/**
 * CategoryCard
 * Карточка категории в стиле референса: заголовок + описание на белой/
 * surface-подложке сверху, плавно перетекающей в фото, которое занимает
 * всю ширину и высоту карточки.
 */
export function CategoryCard({
  category,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
}: CategoryCardProps) {
  // НЕ МЕНЯТЬ: безопасная проверка типа image
  const media = typeof category.image === 'object' ? category.image : null

  // НЕ МЕНЯТЬ: разрешение URL
  const imageUrl = media?.url ? new URL(media.url).pathname : null
  const altText = media?.alt || category.name || 'Категория'

  return (
    <Link
      href={`/catalog/${category.slug}`}
      aria-label={`Открыть категорию ${category.name}`}
      prefetch={false}
      className={`
        group relative isolate block overflow-hidden
        border border-[var(--border)] bg-[var(--surface)]
        shadow-[0_1px_3px_var(--shadow-color)]
        transition-all duration-300 ease-out
        hover:-translate-y-0.5 hover:border-[var(--primary-200)] hover:shadow-[0_12px_28px_var(--shadow-color)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]
        ${className}
      `}
      style={{ borderRadius: 'var(--radius-xl)' }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
        {/* Layer 1 — фото на всю площадь карточки, лёгкий zoom на hover */}
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]">
          <CategoryBackdrop url={imageUrl} alt={altText} sizes={sizes} loading={loading} />
        </div>

        {/* Layer 2 — выцветание фото в белый сверху */}
        <CategoryFade />

        {/* Layer 3 — заголовок и описание */}
        <CategoryContent name={category.name} description={category.description} />
      </div>
    </Link>
  )
}