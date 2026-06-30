// src/components/header/CatalogButton.tsx
// Server component — получает данные, передаёт в клиентский CatalogMenu

import { getCachedCategories } from '@/services/payload/categories'
import { getCachedProductGroups } from '@/services/payload/products'
import { CatalogMenu, type CategoryWithGroups } from './CatalogMenu'

export const CatalogButton = async () => {
  // 1. Все опубликованные категории
  const categories = await getCachedCategories()

  // 2. Для каждой категории — уникальные группы продуктов
  const items: CategoryWithGroups[] = await Promise.all(
    categories.map(async (category) => {
      const getGroups = getCachedProductGroups(String(category.id))
      const groups = await getGroups()
      return { category, groups }
    }),
  )

  return <CatalogMenu items={items} />
}