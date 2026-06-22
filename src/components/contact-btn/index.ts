export { FloatingContacts } from './FloatingContacts'
export type { FloatingContactsProps } from './FloatingContacts'

export { mapSettingsContacts } from './mapContact'
export { MAX_VISIBLE_CONTACTS, buildMenuEntries, useFloatingContacts } from './useFloatingContacts'
export { resolveContactAction, CONTACTS_PAGE_PATH } from './resolveContactAction'
export {
  computeSector,
  computeRadius,
  computeItemPolarPosition,
  computeItemOffset,
  polarToCartesian,
  SECTOR_CENTER_ANGLE_DEG,
  MIN_SECTOR_DEG,
  MAX_SECTOR_DEG,
  SECTOR_GROWTH_PER_ITEM_DEG,
  BASE_RADIUS_PX,
  RADIUS_GROWTH_PER_ITEM_PX,
  MAX_RADIUS_GROWTH_PX,
} from './geometry'

export type { Contact, ContactType, MenuEntry, OverflowContact, PolarPosition, CartesianOffset } from './types'
