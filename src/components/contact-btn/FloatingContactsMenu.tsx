'use client'

import { AnimatePresence } from 'framer-motion'
import { computeItemOffset } from './geometry'
import { FloatingContactItem } from './FloatingContactItem'
import type { MenuEntry } from './types'

interface FloatingContactsMenuProps {
  entries: MenuEntry[]
  isOpen: boolean
  onItemNavigate: () => void
}

/**
 * Pure layout shell for the radial menu. Each entry's position is derived
 * from computeItemOffset(index, total) — purely a function of its index and
 * the total visible count, so adding/removing entries re-flows the whole
 * arrangement automatically with no per-count branching here.
 */
export function FloatingContactsMenu({ entries, isOpen, onItemNavigate }: FloatingContactsMenuProps) {
  return (
    <AnimatePresence>
      {isOpen &&
        entries.map((entry, index) => (
          <FloatingContactItem
            key={entry.id}
            entry={entry}
            offset={computeItemOffset(index, entries.length)}
            onNavigate={onItemNavigate}
          />
        ))}
    </AnimatePresence>
  )
}
