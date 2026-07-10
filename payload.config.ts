import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { ru } from "@payloadcms/translations/languages/ru";
import path from "path";
import { buildConfig } from "payload";
import { CallbackRequests } from "./src/payload/collections/CallbackRequests.ts";
import { Categories } from "./src/payload/collections/Categories.ts";
import { Consents } from "./src/payload/collections/Consents.ts";
import { Media } from "./src/payload/collections/Media.ts";
import { MediaGalleries } from "./src/payload/collections/MediaGalleries.ts";
import { Products } from "./src/payload/collections/Products.ts";
import { Users } from "./src/payload/collections/Users.ts";
import { allowedOrigins } from "./src/payload/config/allowedOrigins.ts";
import { Settings } from "./src/payload/globals/Settings.ts";

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  secret: process.env.PAYLOAD_SECRET!,
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
  // Админка в production открывается на отдельном поддомене
  // (admin.stkaktiv.ru), поэтому его нужно явно разрешить для CORS/CSRF —
  // см. src/payload/config/allowedOrigins.ts.
  cors: allowedOrigins,
  csrf: allowedOrigins,
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: "ru",
  },
  // editor: lexicalEditor({}),
  collections: [
    Categories,
    Products,
    Media,
    CallbackRequests,
    Users,
    Consents,
    MediaGalleries,
  ],
  globals: [Settings],
  typescript: {
    outputFile: path.resolve(process.cwd(), "payload-types.ts"),
  },
  localization: {
    locales: ["ru", "en"],
    defaultLocale: "ru",
  },
  admin: {
    user: "users",
    meta: {
      titleSuffix: " - Админка Каталога",
    },
  },
});
