import { CollectionConfig } from 'payload'
import { seoField } from '@/payload/fields/seo'
import { attributesField } from '@/payload/fields/attributes'
import { documentsField } from '@/payload/fields/documents'
import { normalizeGroup } from '@/payload/hooks/normalizeGroup'
import { isAdminOrManager } from '@/payload/access/isAdminOrManager'
import { generateSlug } from '@/utils/generateSlug'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'group', 'price'] },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: { beforeValidate: [generateSlug] },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      validate: (value) => !value || value.length > 0 || 'Добавьте хотя бы одно фото',
    },
    { name: 'description', type: 'textarea', required: true },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    {
      name: 'group',
      type: 'text',
      label: 'Группа (для заголовков в списке)',
      hooks: { beforeChange: [normalizeGroup] },
      admin: { description: 'Например: "трамвайные", "автомобильные". Будет приведено к нижнему регистру.' },
    },
    { name: 'price', type: 'number', admin: { step: 0.01 } },
    { name: 'showPrice', type: 'checkbox', defaultValue: true },
    attributesField,
    documentsField,
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Новинка', value: 'new' },
        { label: 'Хит', value: 'hit' },
        { label: 'Акция', value: 'sale' },
        { label: 'ГОСТ', value: 'gost' },
      ],
      label: 'Бейджи',
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'isPublished', type: 'checkbox', defaultValue: true },
    seoField,
  ],
}