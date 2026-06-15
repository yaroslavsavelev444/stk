// src/services/payload/products.ts
import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { IProduct } from '@/types/product'
import type { Where } from 'payload'
import { ObjectId } from 'mongodb'

export interface GetProductsOptions {
  category?: string
  group?: string
  limit?: number
  page?: number
  sort?: string
}

// Стабильный ключ для кэша
function getProductsKey(options: GetProductsOptions): string {
  const { category, group, limit, page, sort } = options
  return `products-cat-${category || 'all'}-grp-${group || 'all'}-l-${limit || 20}-p-${page || 1}-s-${sort || 'order'}`
}

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
  return { docs: result.docs as IProduct[], totalDocs: result.totalDocs }
}

export const getCachedProducts = (options: GetProductsOptions) =>
  unstable_cache(
    () => fetchProducts(options),
    [getProductsKey(options)],
    { tags: ['products'], revalidate: false }
  )

async function fetchProductBySlug(slug: string) {
  const payload = await getPayloadInstance()
  const where: Where = { slug: { equals: slug }, isPublished: { equals: true } }
  const result = await payload.find({
    collection: 'products',
    where,
    limit: 1,
    depth: 1,
  })
  return result.docs[0] as IProduct | null
}

export const getCachedProductBySlug = (slug: string) =>
  unstable_cache(
    () => fetchProductBySlug(slug),
    [`product-${slug}`],
    { tags: ['products'], revalidate: false }
  )

/**
 * Получение уникальных групп товаров (масштабируемо через distinct)
 */
export async function getProductGroups(categoryId?: string): Promise<string[]> {
  const payload = await getPayloadInstance()
  const db = payload.db
  const collection = db.collections?.products

  if (!collection) return []

  const filter: any = { isPublished: true }
  if (categoryId && ObjectId.isValid(categoryId)) {
    filter.category = new ObjectId(categoryId)
  }

  const groups = await collection.distinct('group', filter)
  // отфильтровываем null/undefined и сортируем
  return (groups as string[]).filter(Boolean).sort()
}

export const getCachedProductGroups = (categoryId?: string) =>
  unstable_cache(
    () => getProductGroups(categoryId),
    [`product-groups-${categoryId || 'all'}`],
    { tags: ['products'], revalidate: false }
  )