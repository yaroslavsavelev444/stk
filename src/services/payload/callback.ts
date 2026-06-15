// src/services/payload/callback.ts
import { getPayloadInstance } from './getPayload'
import type { ICallbackRequest } from '@/types/callbackRequest'

export interface CreateCallbackData {
  name?: string
  phone: string
  email?: string
  comment?: string
}

/**
 * Создание заявки. Статус проставляется автоматически через defaultValue коллекции.
 * Для защиты от спама рекомендуется добавить rate limit и капчу на уровне API/Server Action.
 */
export async function createCallbackRequest(data: CreateCallbackData): Promise<ICallbackRequest> {
  const payload = await getPayloadInstance()
  const result = await payload.create({
    collection: 'callback-requests',
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      comment: data.comment,
      // status не передаём – полагаемся на defaultValue: 'new'
    },
  })
  return result as ICallbackRequest
}