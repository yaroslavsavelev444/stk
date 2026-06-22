import type { Setting } from '@/payload-types'
import type { Contact, ContactType } from './types'

/**
 * Raw shape coming out of Payload for a single `contacts[]` array item.
 * Mirrors src/payload/globals/Settings.ts. Payload generates this as part
 * of `Setting['contacts']`; re-declared narrowly here so this module has
 * no dependency on exact generated-type shape beyond what it reads.
 */
type RawSettingsContact = NonNullable<Setting['contacts']>[number]

const WHATSAPP_HOST_PATTERN = /(^|\.)wa\.me$|(^|\.)whatsapp\.com$/i
const TELEGRAM_HOST_PATTERN = /(^|\.)t\.me$|(^|\.)telegram\.(me|org)$/i

/**
 * Payload's `type` select currently only offers 'text' | 'phone' | 'email' | 'link'
 * (see Settings.ts). WhatsApp/Telegram are not selectable options yet. Until that
 * field is migrated to include them explicitly, we detect them heuristically from
 * a 'link'-typed contact's URL host, so editors can express a WhatsApp/Telegram
 * contact today by picking "Ссылка" and pasting a wa.me / t.me URL.
 *
 * Recommended follow-up migration (Settings.ts), once you're ready to make this
 * explicit instead of inferred:
 *
 *   {
 *     name: 'type',
 *     type: 'select',
 *     options: [
 *       { label: 'Текст', value: 'text' },
 *       { label: 'Телефон', value: 'phone' },
 *       { label: 'Email', value: 'email' },
 *       { label: 'Ссылка', value: 'link' },
 *       { label: 'WhatsApp', value: 'whatsapp' },
 *       { label: 'Telegram', value: 'telegram' },
 *     ],
 *   },
 *
 * Once that lands, this function's heuristic branch becomes a no-op fallback
 * (the explicit 'whatsapp'/'telegram' raw values get passed through unchanged
 * by the `default` case below — no further code change required).
 */
function resolveContactType(raw: RawSettingsContact): ContactType {
  const rawType = raw.type as string | null | undefined

  if (rawType === 'whatsapp' || rawType === 'telegram' || rawType === 'phone' || rawType === 'email' || rawType === 'text') {
    return rawType
  }

  if (rawType === 'link' && raw.value) {
    try {
      const url = new URL(raw.value)
      if (WHATSAPP_HOST_PATTERN.test(url.host)) return 'whatsapp'
      if (TELEGRAM_HOST_PATTERN.test(url.host)) return 'telegram'
    } catch {
      // Not a parseable absolute URL — fall through to 'link'.
    }
    return 'link'
  }

  return 'text'
}

/** Normalizes one raw Payload contact entry into the component's Contact shape. */
function mapSettingsContactToContact(raw: RawSettingsContact, index: number): Contact {
  return {
    id: raw.id ?? `contact-${index}`,
    title: raw.title ?? '',
    value: raw.value ?? '',
    type: resolveContactType(raw),
    icon: raw.icon ?? '',
    order: typeof raw.order === 'number' ? raw.order : index,
  }
}

/**
 * Normalizes and sorts the full contacts list from Payload Settings.
 * Returns an empty array (never null/undefined) when settings or contacts
 * are absent, so callers never need a defensive null-check.
 */
export function mapSettingsContacts(settings: Setting | null | undefined): Contact[] {
  const raw = settings?.contacts ?? []
  return raw
    .map(mapSettingsContactToContact)
    .sort((a, b) => a.order - b.order)
}
