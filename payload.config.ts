import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { Categories } from './src/payload/collections/Categories.ts'
import { Products } from './src/payload/collections/Products.ts'
import { Media } from './src/payload/collections/Media.ts'
import { CallbackRequests } from './src/payload/collections/CallbackRequests.ts'
import { Users } from './src/payload/collections/Users.ts'
import { Settings } from './src/payload/globals/Settings.ts'
import { ru } from '@payloadcms/translations/languages/ru'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET!,
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
   i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'ru',
  },
  // editor: lexicalEditor({}),
  collections: [Categories, Products, Media, CallbackRequests, Users],
  globals: [Settings],
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
   localization: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
  },
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' - Админка Каталога',
    },
  },
})