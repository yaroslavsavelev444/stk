// src/services/payload/categories.ts
import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { ICategory } from '@/types/category'
import type { Where } from 'payload'

export async function getCategories(): Promise<ICategory[]> {
  const payload = await getPayloadInstance()
  const where: Where = { isPublished: { equals: true } }
  const result = await payload.find({
    collection: 'categories',
    where,
    sort: 'order',
    depth: 1,
  })
  return result.docs
}

export const getCachedCategories = unstable_cache(
  getCategories,
  ['categories-all'],
  { tags: ['categories'], revalidate: false } // revalidate через теги
)

export async function getCategoryBySlug(slug: string): Promise<ICategory | null> {
  const payload = await getPayloadInstance()
  const where: Where = { slug: { equals: slug }, isPublished: { equals: true } }
  const result = await payload.find({
    collection: 'categories',
    where,
    limit: 1,
    depth: 1,
  })
  return result.docs[0] || null
}

export const getCachedCategoryBySlug = (slug: string) =>
  unstable_cache(
    () => getCategoryBySlug(slug),
    [`category-${slug}`],
    { tags: ['categories'], revalidate: false }
  )