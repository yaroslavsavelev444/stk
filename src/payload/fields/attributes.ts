import { Field } from 'payload'

export const attributesField: Field = {
  name: 'attributes',
  type: 'array',
  label: 'Характеристики товара',
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Название' },
    {
      name: 'values',
      type: 'array',
      label: 'Значения',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
  ],
}