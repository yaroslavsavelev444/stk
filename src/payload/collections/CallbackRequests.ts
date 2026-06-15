import { CollectionConfig } from 'payload'
import { authenticated } from '@/payload/access/authenticated'
import { isAdmin } from '@/payload/access/isAdmin'

export const CallbackRequests: CollectionConfig = {
  slug: 'callback-requests',
  admin: { useAsTitle: 'phone', defaultColumns: ['phone', 'name', 'status', 'createdAt'] },
  access: {
    read: authenticated,   // только авторизованные могут читать
    create: () => true,    // публичная отправка (можно добавить rate limit / captcha)
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'comment', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В обработке', value: 'processing' },
        { label: 'Завершена', value: 'completed' },
      ],
      defaultValue: 'new',
    },
  ],
}