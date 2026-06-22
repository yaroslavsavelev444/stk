'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Tooltip } from 'antd'
import type { CartesianOffset, MenuEntry } from './types'
import { ContactIcon, OverflowGlyph } from './ContactIcon'
import { CONTACTS_PAGE_PATH, resolveContactAction } from './resolveContactAction'

/** Diameter (px) of each child circle. */
export const CHILD_CIRCLE_SIZE_PX = 48

/** Diameter (px) of the icon glyph rendered inside a child circle. */
const CHILD_ICON_SIZE_PX = 20

const ITEM_TRANSITION = { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 } as const

const itemVariants = {
  closed: { scale: 0, opacity: 0, x: 0, y: 0 },
  open: (offset: CartesianOffset) => ({
    scale: 1,
    opacity: 1,
    x: offset.x,
    y: offset.y,
    transition: ITEM_TRANSITION,
  }),
}

interface FloatingContactItemProps {
  entry: MenuEntry
  offset: CartesianOffset
  onNavigate: () => void
}

/**
 * Renders a single radial child circle. Handles both real contacts and the
 * synthetic overflow ("all contacts") entry through the same visual treatment,
 * per spec: "Кнопка 'Все контакты' визуально не отличается от остальных".
 */
export function FloatingContactItem({ entry, offset, onNavigate }: FloatingContactItemProps) {
  const isOverflow = entry.kind === 'overflow'

  const label = isOverflow ? 'Все контакты' : entry.title
  const action = isOverflow
    ? { href: CONTACTS_PAGE_PATH, external: false }
    : resolveContactAction(entry)

  const handleClick = () => {
    onNavigate()
  }

  const circleClassName =
    'flex items-center justify-center rounded-full bg-[var(--background)] text-[var(--primary)] ' +
    'border border-[var(--border)] shadow-[0_2px_8px_var(--shadow-color)] ' +
    'transition-shadow duration-150 hover:shadow-[0_6px_18px_var(--shadow-color)]'

  const linkClassName =
    'block rounded-full focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2'

  const content = (
    <motion.div
      className={circleClassName}
      style={{ width: CHILD_CIRCLE_SIZE_PX, height: CHILD_CIRCLE_SIZE_PX, willChange: 'transform, opacity' }}
      whileHover={{ scale: 1.12, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
    >
      {isOverflow ? (
        <OverflowGlyph sizePx={CHILD_ICON_SIZE_PX} />
      ) : (
        <ContactIcon icon={entry.icon} type={entry.type} sizePx={CHILD_ICON_SIZE_PX} />
      )}
    </motion.div>
  )

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ willChange: 'transform, opacity' }}
      custom={offset}
      variants={itemVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <div style={{ transform: 'translate(-50%, -50%)' }}>
        <Tooltip title={label} placement="left">
          {action.external ? (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onClick={handleClick}
              className={linkClassName}
            >
              {content}
            </a>
          ) : (
            <Link href={action.href} aria-label={label} onClick={handleClick} className={linkClassName}>
              {content}
            </Link>
          )}
        </Tooltip>
      </div>
    </motion.div>
  )
}
