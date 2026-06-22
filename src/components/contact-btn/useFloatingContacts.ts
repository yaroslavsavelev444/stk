'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Contact, MenuEntry } from './types'

/**
 * Maximum number of child circles ever rendered at once, INCLUDING the
 * synthetic "all contacts" overflow entry when present. With more contacts
 * than this, the first (MAX_VISIBLE_CONTACTS - 1) sorted contacts are shown
 * plus one overflow entry, so the total rendered count never exceeds this
 * constant regardless of how many contacts exist in the CMS.
 */
export const MAX_VISIBLE_CONTACTS = 8

/**
 * Builds the final list of entries to render: contacts as-is when within
 * the limit, or a truncated list + overflow entry when over the limit.
 * Pure function — no side effects, fully unit-testable in isolation.
 */
export function buildMenuEntries(contacts: Contact[]): MenuEntry[] {
  if (contacts.length <= MAX_VISIBLE_CONTACTS) {
    return contacts.map((contact) => ({ ...contact, kind: 'contact' as const }))
  }

  const visibleContacts = contacts
    .slice(0, MAX_VISIBLE_CONTACTS - 1)
    .map((contact) => ({ ...contact, kind: 'contact' as const }))

  const overflowEntry: MenuEntry = { id: 'overflow-all-contacts', kind: 'overflow' }

  return [...visibleContacts, overflowEntry]
}

interface UseFloatingContactsOptions {
  contacts: Contact[]
}

interface UseFloatingContactsResult {
  isOpen: boolean
  toggle: () => void
  close: () => void
  entries: MenuEntry[]
  /** Ref to attach to the component's outermost DOM node, used for outside-click detection. */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Whether there is at least one contact to show; callers should not render anything if false. */
  hasContacts: boolean
}

export function useFloatingContacts({ contacts }: UseFloatingContactsOptions): UseFloatingContactsResult {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const entries = useMemo(() => buildMenuEntries(contacts), [contacts])
  const hasContacts = entries.length > 0

  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  // Close on outside click (pointerdown fires before click-driven navigation,
  // and works uniformly across mouse/touch).
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      const container = containerRef.current
      if (container && event.target instanceof Node && !container.contains(event.target)) {
        close()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, close])

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  return { isOpen, toggle, close, entries, containerRef, hasContacts }
}
