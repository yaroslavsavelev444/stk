import type { CollectionConfig } from 'payload'
import { isAdminOrManager } from '../access/isAdminOrManager.ts'
import { generateSlug } from '../../utils/generateSlug.ts'
import { seoField } from '../fields/seo.ts'
import { revalidateCategoriesAfterChange, revalidateCategoriesAfterDelete } from '../hooks/revalidateCategories.ts'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order', 'featured', 'isPublished'] },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  hooks: {
    afterChange: [revalidateCategoriesAfterChange],
    afterDelete: [revalidateCategoriesAfterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: { beforeValidate: [generateSlug] },
      admin: { description: 'Автоматически генерируется из названия' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'isPublished', type: 'checkbox', defaultValue: true },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Главная категория',
      defaultValue: false,
      admin: {
        description: 'Показывается увеличенной карточкой в начале списка на главной странице',
      },
    },
    seoField,
  ],
}