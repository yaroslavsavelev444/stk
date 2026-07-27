export type { FloatingContactsProps } from "./FloatingContacts";
export { FloatingContacts } from "./FloatingContacts";
export {
  // BASE_RADIUS_PX,
  computeItemOffset,
  computeItemPolarPosition,
  computeRadius,
  computeSector,
  // MAX_RADIUS_GROWTH_PX,
  // MAX_SECTOR_DEG,
  // MIN_SECTOR_DEG,
  polarToCartesian,
  // RADIUS_GROWTH_PER_ITEM_PX,
  SECTOR_CENTER_ANGLE_DEG,
  // SECTOR_GROWTH_PER_ITEM_DEG,
} from "./geometry";
export { mapSettingsContacts } from "./mapContact";
export {
  CONTACTS_PAGE_PATH,
  resolveContactAction,
} from "./resolveContactAction";
export type {
  CartesianOffset,
  Contact,
  ContactType,
  MenuEntry,
  OverflowContact,
  PolarPosition,
} from "./types";
export {
  buildMenuEntries,
  MAX_VISIBLE_CONTACTS,
  useFloatingContacts,
} from "./useFloatingContacts";
