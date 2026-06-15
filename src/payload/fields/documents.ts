import { Field } from 'payload'

export const documentsField: Field = {
  name: 'documents',
  type: 'array',
  label: 'Документы (сертификаты, паспорта, ГОСТ)',
  fields: [
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Файл документа',
    },
  ],
}