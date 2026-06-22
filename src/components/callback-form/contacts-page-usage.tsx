// app/(frontend)/contacts/page.tsx
// Пример того, как блок встраивается в существующую страницу контактов.
// Замените на реальный импорт остальных секций страницы (ContactsList, MapEmbed и т.д.)

import { CallbackSection } from '@/components/callback-form'

export default function ContactsPage() {
  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-12 sm:px-6">
      {/* ...существующие ContactsList, MapEmbed, SocialLinks... */}

      <CallbackSection />
    </main>
  )
}
