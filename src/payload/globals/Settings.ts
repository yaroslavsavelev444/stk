/**
 * OPTIONAL migration: src/payload/globals/Settings.ts
 *
 * The FloatingContacts component supports 'whatsapp' and 'telegram' as
 * first-class contact types (distinct icon + distinct deep-link handling).
 * Today they are inferred heuristically from a 'link'-typed contact whose
 * URL host is wa.me/whatsapp.com or t.me/telegram.(me|org) — see
 * src/components/contacts-floating/mapContact.ts.
 *
 * That heuristic works without touching the CMS schema, but editors can't
 * explicitly pick "WhatsApp" / "Telegram" from the type dropdown until you
 * apply this one-field change. It's purely additive — existing 'text' |
 * 'phone' | 'email' | 'link' values and the URL-sniffing fallback keep
 * working unchanged after this lands.
 *
 * Diff to apply inside the `contacts` array field's `type` select:
 */

import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo.ts'
import { revalidateSettings } from '../hooks/revalidateSettings.ts'
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    afterChange: [revalidateSettings],
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
            // --- added ---
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Telegram', value: 'telegram' },
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
    {
      name: 'heroBackground',
      type: 'group',
      label: 'Фон первого экрана (Hero)',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Тип фона',
          defaultValue: 'none',
          options: [
            { label: 'Нет (стандартный фон)', value: 'none' },
            { label: 'Изображение', value: 'image' },
            { label: 'Видео', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Фоновое изображение',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
            description: 'Горизонтальное изображение, не менее 1920×1080px.',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          label: 'Фоновое видео',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
            description:
              'MP4/WebM без звука, короткий зацикленный ролик. Для быстрой загрузки желательно сжать файл (H.264, до ~8МБ).',
          },
        },
        {
          name: 'videoPoster',
          type: 'upload',
          relationTo: 'media',
          label: 'Постер видео',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
            description: 'Показывается, пока видео ещё грузится, и на медленном интернете.',
          },
        },
      ],
    },
    seoField,
  ],
}
