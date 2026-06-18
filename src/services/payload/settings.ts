import { unstable_cache } from 'next/cache';
import { getPayloadInstance } from './getPayload';
import type { Setting } from '@/payload-types';

async function fetchSettings(): Promise<Setting | null> {
  const payload = await getPayloadInstance();
  const result = await payload.findGlobal({ slug: 'settings', depth: 1 });
  return result as Setting | null;
}

// Включаем кэш для всех окружений, но в dev можно убрать для удобства
export const getCachedSettings = 
  process.env.NODE_ENV === 'development'
    ? fetchSettings
    : unstable_cache(fetchSettings, ['settings'], { tags: ['settings'], revalidate: false });