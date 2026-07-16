// src/components/header/CatalogButton.tsx
// Server component — получает данные, передаёт в клиентский CatalogMenu

import { getCachedCategories } from '@/services/payload/categories'
import { getCachedSubcategories } from '@/services/payload/subcategories'
import { CatalogMenu, type CategoryWithSubcategories } from './CatalogMenu'

export const CatalogButton = async () => {
  // 1. Все опубликованные категории
  const categories = await getCachedCategories()

  // 2. Для каждой категории — её опубликованные подкатегории
  const items: CategoryWithSubcategories[] = await Promise.all(
    categories.map(async (category) => {
      const getSubcategories = getCachedSubcategories(String(category.id))
      const subcategories = await getSubcategories()
      return { category, subcategories }
    }),
  )

  return <CatalogMenu items={items} />
}