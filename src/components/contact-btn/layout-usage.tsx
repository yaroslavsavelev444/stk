// app/(frontend)/layout.tsx
// Example of wiring FloatingContacts into the root frontend layout so it
// renders on every page. getCachedSettings() runs server-side (it's an
// async Server Component call), and only the already-normalized plain
// `Contact[]` data crosses the server/client boundary into the client
// component tree — keeping FloatingContacts itself free of any Payload
// or caching concerns.

import { getCachedSettings } from '@/services/payload/settings'
import { mapSettingsContacts } from './mapContact'
import { FloatingContacts } from './FloatingContacts'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getCachedSettings()
  const contacts = mapSettingsContacts(settings)

  return (
    <html lang="ru">
      <body>
        {children}
        <FloatingContacts contacts={contacts} />
      </body>
    </html>
  )
}
