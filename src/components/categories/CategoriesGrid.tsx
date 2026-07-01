import { Suspense } from 'react'
import { getCachedCategories } from '@/services/payload/categories'
import { CategoryCard } from './CategoryCard'
import { CategoryGridSkeleton } from './CategoryGridSkeleton'

/** sizes-хинт для next/image, синхронизирован с брейкпоинтами сетки ниже */
const CATEGORY_CARD_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

/** Число первых карточек, которые грузим eager (видны на первом экране) */
const EAGER_COUNT = 3

async function CategoriesGridContent() {
  const categories = await getCachedCategories()

  if (!categories?.length) {
    return (
      <p className="text-center py-12 text-[var(--text-secondary)]">
        Категории пока не добавлены
      </p>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
      role="list"
      aria-label="Категории продукции"
    >
      {categories.map((category, index) => (
        <div key={category.id} role="listitem">
          <CategoryCard
            category={category}
            sizes={CATEGORY_CARD_SIZES}
            loading={index < EAGER_COUNT ? 'eager' : 'lazy'}
          />
        </div>
      ))}
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