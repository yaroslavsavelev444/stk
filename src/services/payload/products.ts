import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { Where } from 'payload'
import { Product } from '@/payload-types'

export interface GetProductsOptions {
  category?: string
  group?: string
  limit?: number
  page?: number
  sort?: string
}

// ---- Вспомогательная генерация ключа ----
function getProductsKey(options: GetProductsOptions): string {
  const { category, group, limit, page, sort } = options
  return `products-cat-${category || 'all'}-grp-${group || 'all'}-l-${limit || 20}-p-${page || 1}-s-${sort || 'order'}`
}

// ---- Базовые функции (без кэша) ----
async function fetchProducts(options: GetProductsOptions) {
  const payload = await getPayloadInstance()
  const where: Where = { isPublished: { equals: true } }
  if (options.category) where.category = { equals: options.category }
  if (options.group) where.group = { equals: options.group }

  const result = await payload.find({
    collection: 'products',
    where,
    sort: options.sort || 'order',
    limit: options.limit || 20,
    page: options.page || 1,
    depth: 1,
  })
  return { docs: result.docs as unknown as Product[], totalDocs: result.totalDocs }
}

async function fetchProductBySlug(slug: string) {
  const payload = await getPayloadInstance()
  const where: Where = { slug: { equals: slug }, isPublished: { equals: true } }

  const result = await payload.find({
    collection: 'products',
    where,
    limit: 1,
    depth: 2,                    // ← Важно! Подтягиваем recommendedProducts
  })
  return result.docs[0] as Product | null
}

async function fetchProductGroups(categoryId?: string): Promise<string[]> {
  const payload = await getPayloadInstance()
  const db = payload.db
  const collection = db.collections?.products

  if (!collection) return []

  const filter: Record<string, unknown> = { isPublished: true }
  if (categoryId) {
    filter.category = categoryId // строка – драйвер сам преобразует в ObjectId
  }

  const groups = await collection.distinct('group', filter)
  return (groups as string[]).filter(Boolean).sort()
}

// ---- Экспортируемые обёртки с условным кэшированием ----
// ВСЕГДА возвращают функцию, которую нужно вызвать для получения данных.
// В dev – просто обёртка над fetch*, в prod – мемоизированная через unstable_cache.

export const getCachedProducts = (options: GetProductsOptions) => {
  if (process.env.NODE_ENV === 'development') {
    return () => fetchProducts(options)
  }
  return unstable_cache(
    () => fetchProducts(options),
    [getProductsKey(options)],
    { tags: ['products'], revalidate: false }
  )
}

export const getCachedProductBySlug = (slug: string) => {
  if (process.env.NODE_ENV === 'development') {
    return () => fetchProductBySlug(slug)
  }
  return unstable_cache(
    () => fetchProductBySlug(slug),
    [`product-${slug}`],
    { tags: ['products'], revalidate: false }
  )
}

export const getCachedProductGroups = (categoryId?: string) => {
  if (process.env.NODE_ENV === 'development') {
    return () => fetchProductGroups(categoryId)
  }
  return unstable_cache(
    () => fetchProductGroups(categoryId),
    [`product-groups-${categoryId || 'all'}`],
    { tags: ['products'], revalidate: false }
  )
}