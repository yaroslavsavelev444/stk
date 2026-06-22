'use client'

import { motion } from 'framer-motion'

/** Diameter (px) of the main toggle button. */
export const MAIN_BUTTON_SIZE_PX = 60

const ICON_SIZE_PX = 24

interface FloatingContactsButtonProps {
  isOpen: boolean
  onToggle: () => void
}

/**
 * The always-visible main circle. Cross-fades its glyph between a "contacts"
 * icon (two overlapping circles) and a cross/X when toggled, while the whole
 * button rotates 135deg on open for a combined "spin into an X" feel.
 * Only transform/opacity are animated — no layout-affecting properties.
 */
export function FloatingContactsButton({ isOpen, onToggle }: FloatingContactsButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-haspopup="true"
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Закрыть меню контактов' : 'Открыть меню контактов'}
      className="relative flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--text-inverse)]
        shadow-[0_6px_20px_var(--shadow-color)] transition-colors duration-150 hover:bg-[var(--primary-hover)]
        focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
      style={{ width: MAIN_BUTTON_SIZE_PX, height: MAIN_BUTTON_SIZE_PX, willChange: 'transform' }}
      whileTap={{ scale: 0.94 }}
      animate={{ rotate: isOpen ? 135 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <svg
        width={ICON_SIZE_PX}
        height={ICON_SIZE_PX}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {/* Cross glyph: fades/scales in as the button rotates 135deg, so the
            two strokes read as an "X" once open. */}
        <motion.g
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.6 }}
          transition={{ duration: 0.15 }}
          style={{ transformOrigin: '12px 12px' }}
        >
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </motion.g>

        {/* Contacts glyph (two overlapping circles): fades/scales out on open. */}
        <motion.g
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.6 : 1 }}
          transition={{ duration: 0.15 }}
          style={{ transformOrigin: '12px 12px' }}
        >
          <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="15" cy="15" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </motion.g>
      </svg>
    </motion.button>
  )
}
