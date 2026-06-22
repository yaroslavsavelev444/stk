/**
 * Domain types for the Floating Contacts Menu.
 *
 * NOTE on Payload schema alignment:
 * `Settings.contacts[].type` in payload/globals/Settings.ts currently only
 * defines the select options: 'text' | 'phone' | 'email' | 'link'.
 * The product spec for this component additionally requires 'whatsapp' and
 * 'telegram' as first-class types (distinct icon, distinct deep-link rules).
 *
 * To support that without guessing at undocumented CMS values, this module
 * defines the full type union the *component* understands, and the mapping
 * layer (mapSettingsContactToContact) is responsible for normalizing raw
 * Payload values (which today can only be 'text' | 'phone' | 'email' | 'link')
 * into this richer union — see contacts-floating/mapContact.ts.
 *
 * To actually let editors pick "WhatsApp" / "Telegram" in the admin UI,
 * add the two options to the `type` select in Settings.ts (see the patch
 * note at the bottom of mapContact.ts). Until that field migration lands,
 * those types are reachable by setting `type: 'link'` with a wa.me / t.me
 * URL, which mapContact.ts auto-detects and upgrades.
 */

export type ContactType = 'phone' | 'email' | 'link' | 'whatsapp' | 'telegram' | 'text'

/** Normalized contact, ready for rendering — independent of raw CMS shape. */
export interface Contact {
  /** Stable unique key (falls back to index-derived id if CMS provides none). */
  id: string
  title: string
  value: string
  type: ContactType
  /** FontAwesome class name (e.g. "fa-solid fa-phone") or absolute image URL. Empty string if not provided by CMS. */
  icon: string
  order: number
}

/** Synthetic entry injected when the contact list exceeds the visible limit. */
export interface OverflowContact {
  id: 'overflow-all-contacts'
  kind: 'overflow'
}

export type MenuEntry = (Contact & { kind: 'contact' }) | OverflowContact

export interface PolarPosition {
  /** Angle in degrees, screen-space (0° = right, 90° = up, measured counter-clockwise). */
  angleDeg: number
  /** Distance from the main button's center, in pixels. */
  radius: number
}

export interface CartesianOffset {
  /** Horizontal offset from the main button's center, in pixels. Negative = left. */
  x: number
  /** Vertical offset from the main button's center, in pixels. Negative = up. */
  y: number
}
