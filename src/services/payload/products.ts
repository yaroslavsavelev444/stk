import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { Where } from 'payload'
import { Product } from '@/payload-types'

export interface GetProductsOptions {
  category?: string
  limit?: number
  page?: number
  sort?: string
}

// ---- Вспомогательная генерация ключа ----
function getProductsKey(options: GetProductsOptions): string {
  const { category, limit, page, sort } = options
  return `products-cat-${category || 'all'}-l-${limit || 20}-p-${page || 1}-s-${sort || 'order'}`
}

// ---- Базовые функции (без кэша) ----
async function fetchProducts(options: GetProductsOptions) {
  const payload = await getPayloadInstance()
  const where: Where = { isPublished: { equals: true } }
  if (options.category) where.category = { equals: options.category }

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
