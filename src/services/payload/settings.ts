import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { Setting } from '@/payload-types' // импортируем правильный тип

async function fetchSettings(): Promise<Setting | null> {
  const payload = await getPayloadInstance()
  const result = await payload.findGlobal({ slug: 'settings', depth: 1 })
  // findGlobal возвращает один документ типа Setting, приведение безопасно
  return result as Setting | null
}

export const getCachedSettings = unstable_cache(
  fetchSettings,
  ['settings'],
  { tags: ['settings'], revalidate: false }
)