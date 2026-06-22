'use client'

import { useCallback } from 'react'
import { useFloatingContacts } from './useFloatingContacts'
import { FloatingContactsButton, MAIN_BUTTON_SIZE_PX } from './FloatingContactsButton'
import { FloatingContactsMenu } from './FloatingContactsMenu'
import type { Contact } from './types'

/** Fixed offset (px) of the component from the viewport's right/bottom edges. */
const VIEWPORT_MARGIN_PX = 24

export interface FloatingContactsProps {
  /**
   * Pre-normalized contacts (see mapContact.ts -> mapSettingsContacts).
   * This component is intentionally data-source agnostic: a Server Component
   * higher in the tree is expected to call getCachedSettings() and pass
   * mapSettingsContacts(settings) in, keeping this component (and the whole
   * contacts-floating/ subtree) a plain client component with no direct
   * dependency on Payload or data-fetching/caching concerns. See
   * examples/floating-contacts-usage.tsx for the wiring.
   */
  contacts: Contact[]
}

/**
 * Fixed bottom-right floating contacts launcher. Renders nothing (not even
 * the main button) when `contacts` is empty, so an empty CMS array never
 * shows a dead-end control. SSR-safe: no `window`/`document` access during
 * render, all browser APIs are confined to effects inside useFloatingContacts.
 */
export function FloatingContacts({ contacts }: FloatingContactsProps) {
  const { isOpen, toggle, close, entries, containerRef, hasContacts } = useFloatingContacts({ contacts })

  const handleItemNavigate = useCallback(() => {
    close()
  }, [close])

  if (!hasContacts) return null

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{
        right: VIEWPORT_MARGIN_PX,
        bottom: VIEWPORT_MARGIN_PX,
        width: MAIN_BUTTON_SIZE_PX,
        height: MAIN_BUTTON_SIZE_PX,
      }}
    >
      <div className="relative h-full w-full">
        <FloatingContactsMenu entries={entries} isOpen={isOpen} onItemNavigate={handleItemNavigate} />
        <FloatingContactsButton isOpen={isOpen} onToggle={toggle} />
      </div>
    </div>
  )
}
