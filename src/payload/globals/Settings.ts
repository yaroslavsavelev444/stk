import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo.ts'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'companyName', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'contacts',
      type: 'array',
      label: 'Контакты',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Текст', value: 'text' },
            { label: 'Телефон', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'Ссылка', value: 'link' },
          ],
        },
        { name: 'icon', type: 'text', label: 'Иконка (FontAwesome класс или URL)' },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Соцсети',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'url', type: 'text', required: true },
        { name: 'icon', type: 'text' },
      ],
    },
    { name: 'workingHours', type: 'text', label: 'Часы работы' },
    { name: 'map', type: 'textarea', label: 'Код Яндекс.Карты (iframe src или embed)' },
    seoField,
  ],
}