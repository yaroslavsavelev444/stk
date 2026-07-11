import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/payload-types'

interface CategoryCardProps {
  category: Category
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  /** 'large' — увеличенная карточка для главных (featured) категорий */
  size?: 'default' | 'large'
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
  size = 'default',
}: {
  name: string
  description?: string | null
  size?: 'default' | 'large'
}) {
  return (
    <div className={`relative z-[2] flex flex-col gap-2 ${size === 'large' ? 'p-6 md:p-8' : 'p-5 md:p-6'}`}>
      <h3
        className={`font-bold leading-snug tracking-[-0.01em] text-[var(--text-primary)] ${
          size === 'large' ? 'text-[1.4rem] md:text-[1.7rem]' : 'text-[1.15rem] md:text-[1.3rem]'
        }`}
      >
        {name}
      </h3>

      {description && (
        <p
          className={`leading-relaxed text-[var(--text-secondary)] ${size === 'large' ? 'text-sm md:text-base' : 'text-sm'}`}
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
  size = 'default',
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
      <div
        className={`relative w-full overflow-hidden ${size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
        style={{ borderRadius: 'var(--radius-xl)' }}
      >
        {/* Layer 1 — фото на всю площадь карточки, лёгкий zoom на hover */}
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]">
          <CategoryBackdrop url={imageUrl} alt={altText} sizes={sizes} loading={loading} />
        </div>

        {/* Layer 2 — выцветание фото в белый сверху */}
        <CategoryFade />

        {/* Layer 3 — заголовок и описание */}
        <CategoryContent name={category.name} description={category.description} size={size} />
      </div>
    </Link>
  )
}