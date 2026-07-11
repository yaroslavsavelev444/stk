import { unstable_cache } from 'next/cache';
import { getPayloadInstance } from './getPayload';
import type { Where } from 'payload';
import type { Category } from '@/payload-types';

async function fetchCategories(): Promise<Category[]> {
  const payload = await getPayloadInstance();
  const where: Where = { isPublished: { equals: true } };
  const result = await payload.find({
    collection: 'categories',
    where,
    sort: '-featured,order',
    depth: 1,
  });
  return result.docs as unknown as Category[];
}

// В development отключаем кэш, чтобы видеть изменения на лету
export const getCachedCategories =
  process.env.NODE_ENV === 'development'
    ? fetchCategories
    : unstable_cache(fetchCategories, ['categories-all'], {
        tags: ['categories'],
        revalidate: false,
      });

async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const payload = await getPayloadInstance();
  const where: Where = {
    slug: { equals: slug },
    isPublished: { equals: true },
  };
  const result = await payload.find({
    collection: 'categories',
    where,
    limit: 1,
    depth: 1,
  });
  return (result.docs[0] || null) as unknown as Category | null;
}

export const getCachedCategoryBySlug = (slug: string) =>
  process.env.NODE_ENV === 'development'
    ? () => fetchCategoryBySlug(slug)
    : unstable_cache(
        () => fetchCategoryBySlug(slug),
        [`category-${slug}`],
        { tags: ['categories'], revalidate: false }
      );