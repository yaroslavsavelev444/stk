import type { Contact } from './types'

export const CONTACTS_PAGE_PATH = '/contacts'

export interface ContactAction {
  /** href to navigate to. Always present, including for 'text' (points at the contacts page). */
  href: string
  /** Whether this should open in a new tab (external destinations). */
  external: boolean
}

/**
 * Strips all non-digit characters except a leading '+', so values entered in
 * the CMS as "+7 (999) 000-00-00" still produce a valid tel: URI.
 */
function toTelHref(value: string): string {
  const trimmed = value.trim()
  const hasLeadingPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')
  return `tel:${hasLeadingPlus ? '+' : ''}${digits}`
}

function toMailtoHref(value: string): string {
  return `mailto:${value.trim()}`
}

/** Ensures a possibly-bare URL (no protocol) becomes an absolute, navigable href. */
function toAbsoluteHref(value: string): string {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/^(mailto|tel):/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/**
 * Resolves the click-through action for a contact, per the type-to-action
 * mapping in the spec: phone → tel:, email → mailto:, whatsapp/telegram/link →
 * external URL, text → contacts page.
 */
export function resolveContactAction(contact: Contact): ContactAction {
  switch (contact.type) {
    case 'phone':
      return { href: toTelHref(contact.value), external: false }
    case 'email':
      return { href: toMailtoHref(contact.value), external: false }
    case 'whatsapp':
    case 'telegram':
    case 'link':
      return { href: toAbsoluteHref(contact.value), external: true }
    case 'text':
    default:
      return { href: CONTACTS_PAGE_PATH, external: false }
  }
}
