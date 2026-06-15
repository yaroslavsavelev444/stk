import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { Categories } from './src/payload/collections/Categories'
import { Products } from './src/payload/collections/Products'
import { Media } from './src/payload/collections/Media'
import { CallbackRequests } from './src/payload/collections/CallbackRequests'
import { Users } from './src/payload/collections/Users'
import { Settings } from './src/payload/globals/Settings'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET!,
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
  editor: lexicalEditor({}),
  collections: [Categories, Products, Media, CallbackRequests, Users],
  globals: [Settings],
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' - Админка Каталога',
    },
  },
})