// src/services/payload/settings.ts
import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { ISettings } from '@/types/settings'

async function fetchSettings(): Promise<ISettings | null> {
  const payload = await getPayloadInstance()
  const result = await payload.findGlobal({ slug: 'settings', depth: 1 })
  return result as ISettings | null
}

export const getCachedSettings = unstable_cache(
  fetchSettings,
  ['settings'],
  { tags: ['settings'], revalidate: false }
)