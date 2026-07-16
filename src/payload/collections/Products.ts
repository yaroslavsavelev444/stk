import type { CollectionConfig } from 'payload'
import { isAdminOrManager } from '../access/isAdminOrManager.ts'
import { generateSlug } from '../../utils/generateSlug.ts'
import { attributesField } from '../fields/attributes.ts'
import { documentsField } from '../fields/documents.ts'
import { seoField } from '../fields/seo.ts'
import { revalidateProductsAfterChange, revalidateProductsAfterDelete } from '../hooks/revalidateProducts.ts'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'subcategory', 'price', 'isPublished'],
  },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  hooks: {
    afterChange: [revalidateProductsAfterChange],
    afterDelete: [revalidateProductsAfterDelete],
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
      name: 'subcategory',
      type: 'relationship',
      relationTo: 'subcategories',
      label: 'Подкатегория',
      admin: {
        description: 'Список ограничен подкатегориями выбранной категории. Сначала выберите категорию.',
        condition: (data) => Boolean(data?.category),
      },
      filterOptions: ({ siblingData }) => {
        const category = (siblingData as { category?: string } | undefined)?.category
        if (!category) return false
        return { category: { equals: category }, isPublished: { equals: true } }
      },
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

    // === Новое поле ===
    {
      name: 'recommendedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Рекомендуемые товары',
      admin: {
        description: 'Выберите товары, которые будут показаны в блоке "Рекомендуемые" на странице этого товара. Порядок важен.',
        position: 'sidebar',
        isSortable: true,           // можно менять порядок
      },
      filterOptions: ({ data }) => ({
        id: { not_equals: data?.id },        // исключаем сам товар
        isPublished: { equals: true },
      }),
    },

    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'isPublished', type: 'checkbox', defaultValue: true },
    seoField,
  ],
}