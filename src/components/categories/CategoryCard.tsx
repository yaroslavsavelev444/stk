import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/payload-types';

interface CategoryCardProps {
  category: Category;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export function CategoryCard({
  category,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
}: CategoryCardProps) {
  // Безопасная проверка типа image (НЕ МЕНЯТЬ)
  const media =
    typeof category.image === 'object'
      ? category.image
      : null;

  // НЕ МЕНЯТЬ
  const imageUrl =
    media?.url
      ? new URL(media.url).pathname
      : null;
  const altText = media?.alt || category.name || 'Категория';

  return (
    <Link
      href={`/catalog/${category.slug}`}
      aria-label={`Открыть категорию ${category.name}`}
      prefetch={false}
      className={`
        group relative block overflow-hidden rounded-3xl
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        bg-surface-secondary isolate
        ${className}
      `}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes={sizes}
          loading={loading}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
      )}

      {/* Градиентный оверлей снизу */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Заголовок — всегда виден */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-xl font-bold leading-tight drop-shadow-md md:text-2xl lg:text-3xl">
          {category.name}
        </h3>
        {/* Description — появляется только при наведении */}
        {category.description && (
          <div className="overflow-hidden">
            <p
              className={`
                mt-1 text-sm text-white/80 drop-shadow-sm line-clamp-2
                transition-all duration-200 ease-out
                opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
              `}
            >
              {category.description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}