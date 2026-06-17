import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { Where } from 'payload'
import { Category } from '@/payload-types'

export async function getCategories(): Promise<Category[]> {
  const payload = await getPayloadInstance()
  const where: Where = { isPublished: { equals: true } }
  const result = await payload.find({
    collection: 'categories',
    where,
    sort: 'order',
    depth: 1,
  })
  // Приведение через unknown, т.к. Payload возвращает общий тип, но мы уверены в структуре
  return result.docs as unknown as Category[]
}

export const getCachedCategories = unstable_cache(
  getCategories,
  ['categories-all'],
  { tags: ['categories'], revalidate: false }
)

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const payload = await getPayloadInstance()
  const where: Where = { slug: { equals: slug }, isPublished: { equals: true } }
  const result = await payload.find({
    collection: 'categories',
    where,
    limit: 1,
    depth: 1,
  })
  return (result.docs[0] || null) as unknown as Category | null
}

export const getCachedCategoryBySlug = (slug: string) =>
  unstable_cache(
    () => getCategoryBySlug(slug),
    [`category-${slug}`],
    { tags: ['categories'], revalidate: false }
  )