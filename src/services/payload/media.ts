// src/services/payload/media.ts
import { unstable_cache } from 'next/cache'
import { getPayloadInstance } from './getPayload'
import type { IMedia } from '@/types/media'
import type { Where } from 'payload'

export async function getMediaByType(type: IMedia['type'], limit = 20): Promise<IMedia[]> {
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
  return result.docs as IMedia[]
}

export const getCachedMediaByType = (type: IMedia['type'], limit = 20) =>
  unstable_cache(
    () => getMediaByType(type, limit),
    [`media-${type}-${limit}`],
    { tags: [`media-${type}`], revalidate: false }
  )