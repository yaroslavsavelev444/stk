import { Suspense } from 'react'
import { getCachedCategories } from '@/services/payload/categories'
import { CategoryCard } from './CategoryCard'
import { CategoryGridSkeleton } from './CategoryGridSkeleton'
import { resolveCards } from './Gridpatternresolver'

async function CategoriesGridContent() {
  const categories = await getCachedCategories()
  if (!categories?.length) {
    return <p className="text-center py-12 text-[var(--text-secondary)]">Категории пока не добавлены</p>
  }

  const resolved = resolveCards(
    categories.map(c => ({ name: c.name, description: c.description }))
  )

  return (
    <div
      className="grid grid-cols-12 auto-rows-[minmax(240px,auto)] gap-3 md:gap-4 lg:gap-5"
      role="list"
      aria-label="Категории продукции"
    >
      {categories.map((category, index) => {
        const { pattern, gridClasses, imageSizes, imageLoading } = resolved[index]
        return (
          <div
            key={category.id}
            className={gridClasses}
            role="listitem"
          >
            <CategoryCard
              category={category}
              pattern={pattern}
              className="w-full h-full"   // ← важно
              sizes={imageSizes}
              loading={imageLoading}
            />
          </div>
        )
      })}
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