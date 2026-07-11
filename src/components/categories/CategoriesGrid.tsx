import { Suspense } from 'react'
import { getCachedCategories } from '@/services/payload/categories'
import { CategoryCard } from './CategoryCard'
import { CategoryGridSkeleton } from './CategoryGridSkeleton'
import type { Category } from '@/payload-types'

/** sizes-хинт для next/image, синхронизирован с брейкпоинтами сетки ниже */
const CATEGORY_CARD_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

/** sizes-хинт для увеличенных карточек главных категорий (до 2 в ряд) */
const FEATURED_CARD_SIZES = '(max-width: 640px) 100vw, 50vw'

/** Число первых карточек, которые грузим eager (видны на первом экране) */
const EAGER_COUNT = 3

function CategoryListItem({
  category,
  sizes,
  loading,
  size,
}: {
  category: Category
  sizes: string
  loading: 'lazy' | 'eager'
  size?: 'default' | 'large'
}) {
  return (
    <div role="listitem">
      <CategoryCard category={category} sizes={sizes} loading={loading} size={size} />
    </div>
  )
}

async function CategoriesGridContent() {
  const categories = await getCachedCategories()

  if (!categories?.length) {
    return (
      <p className="text-center py-12 text-[var(--text-secondary)]">
        Категории пока не добавлены
      </p>
    )
  }

  const featured = categories.filter((category) => category.featured)
  const normal = categories.filter((category) => !category.featured)

  // Нет главных категорий — сетка не отличается от текущей
  if (featured.length === 0) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
        role="list"
        aria-label="Категории продукции"
      >
        {categories.map((category, index) => (
          <CategoryListItem
            key={category.id}
            category={category}
            sizes={CATEGORY_CARD_SIZES}
            loading={index < EAGER_COUNT ? 'eager' : 'lazy'}
          />
        ))}
      </div>
    )
  }

  // Единственная главная категория — подставляем рядом первую обычную,
  // чтобы в верхнем ряду не осталось пустого места
  const pairedNormal = featured.length === 1 ? normal[0] : undefined
  const restNormal = pairedNormal ? normal.slice(1) : normal
  const featuredRowHasTwo = featured.length >= 2 || Boolean(pairedNormal)

  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <div
        className={`grid grid-cols-1 ${featuredRowHasTwo ? 'sm:grid-cols-2' : ''} gap-4 md:gap-5 lg:gap-6`}
        role="list"
        aria-label="Главные категории"
      >
        {featured.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            sizes={FEATURED_CARD_SIZES}
            loading="eager"
            size="large"
          />
        ))}
        {pairedNormal && (
          <CategoryListItem
            key={pairedNormal.id}
            category={pairedNormal}
            sizes={FEATURED_CARD_SIZES}
            loading="eager"
            size="large"
          />
        )}
      </div>

      {restNormal.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
          role="list"
          aria-label="Категории продукции"
        >
          {restNormal.map((category, index) => (
            <CategoryListItem
              key={category.id}
              category={category}
              sizes={CATEGORY_CARD_SIZES}
              loading={index < EAGER_COUNT ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CategoriesGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 md:pt-10 lg:pt-12 pb-14 md:pb-20 lg:pb-24">
      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoriesGridContent />
      </Suspense>
    </section>
  )
}
