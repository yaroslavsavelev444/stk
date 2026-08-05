import type { Contact } from "./types";

export const CONTACTS_PAGE_PATH = "/contacts";

export interface ContactAction {
  /** href to navigate to. Always present, including for 'text' (points at the contacts page). */
  href: string;
  /**
   * Whether `href` is a route inside this Next.js app (only the synthetic
   * "contacts page" destination). Only these should render as `next/link`'s
   * `<Link>` — everything else (tel:, mailto:, and real external URLs) MUST
   * render as a plain `<a>`.
   *
   * Why this matters: `<Link>` drives Next's client-side router, which tries
   * to resolve `href` as an in-app route. `tel:`/`mailto:` are not HTTP(S)
   * app routes, so the router can't match them — in the best case it's a
   * silent no-op (phone), in the worst case it falls through to `/` (email).
   * A plain `<a href="tel:...">` / `<a href="mailto:...">` is left alone by
   * the browser and handed straight to the OS's registered protocol handler,
   * which is what actually opens the dialer / mail client.
   */
  isInternalRoute: boolean;
  /** Whether this should open in a new browser tab (genuine external web pages only). */
  openInNewTab: boolean;
}

/**
 * Strips all non-digit characters except a leading '+', so values entered in
 * the CMS as "+7 (999) 000-00-00" still produce a valid tel: URI.
 */
function toTelHref(value: string): string {
  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `tel:${hasLeadingPlus ? "+" : ""}${digits}`;
}

function toMailtoHref(value: string): string {
  return `mailto:${value.trim()}`;
}

/** Ensures a possibly-bare URL (no protocol) becomes an absolute, navigable href. */
function toAbsoluteHref(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(mailto|tel):/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Resolves the click-through action for a contact, per the type-to-action
 * mapping in the spec: phone → tel:, email → mailto:, whatsapp/telegram/link →
 * external URL, text → contacts page.
 *
 * Only 'text' points at an in-app route, so it's the only case with
 * `isInternalRoute: true`. Every other case is a browser-native protocol
 * (tel:/mailto:) or a genuinely external page, and must NOT go through
 * Next's client router — see the `isInternalRoute` doc comment above.
 */
export function resolveContactAction(contact: Contact): ContactAction {
  switch (contact.type) {
    case "phone":
      return {
        href: toTelHref(contact.value),
        isInternalRoute: false,
        openInNewTab: false,
      };
    case "email":
      return {
        href: toMailtoHref(contact.value),
        isInternalRoute: false,
        openInNewTab: false,
      };
    case "whatsapp":
    case "telegram":
    case "link":
      return {
        href: toAbsoluteHref(contact.value),
        isInternalRoute: false,
        openInNewTab: true,
      };
    case "text":
    default:
      return {
        href: CONTACTS_PAGE_PATH,
        isInternalRoute: true,
        openInNewTab: false,
      };
  }
}
