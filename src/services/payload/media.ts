import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { Where } from 'payload'
import { Media } from '@/payload-types'

export async function getMediaByType(type: Media['type'], limit = 20): Promise<Media[]> {
  const payload = await getPayloadInstance()
  const where: Where = { type: { equals: type } }
  // Примечание: если используется Draft, добавьте условие _status: 'published'
  const result = await payload.find({
    collection: 'media',
    where,
    sort: '-createdAt',
    limit,
    depth: 0,
  })
  return result.docs as unknown as Media[]
}

export const getCachedMediaByType = (type: Media['type'], limit = 20) =>
  unstable_cache(
    () => getMediaByType(type, limit),
    [`media-${type}-${limit}`],
    { tags: [`media-${type}`], revalidate: false }
  )