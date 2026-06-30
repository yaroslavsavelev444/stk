'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, LayoutGrid, X } from 'lucide-react'
import type { Category } from '@/payload-types'

export interface CategoryWithGroups {
  category: Category
  groups: string[]
}

interface CatalogMenuProps {
  items: CategoryWithGroups[]
}

function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function CatalogMenu({ items }: CatalogMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuTop, setMenuTop] = useState(0)

  const close = useCallback(() => setOpen(false), [])

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setMenuTop(rect.bottom)
  }, [])

  
  // Обновление позиции
  useEffect(() => {
    if (!open) return
    updatePosition()
    const observer = new ResizeObserver(updatePosition)
    if (triggerRef.current) observer.observe(triggerRef.current)
    window.addEventListener('resize', updatePosition)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  // Закрытие по клику вне
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close])

  // Закрытие по Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close])

  return (
    <div ref={containerRef} className="relative z-[100]">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Открыть каталог"
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
          transition-all duration-200 select-none focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40
          ${
            open
              ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
              : 'bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white hover:shadow-md hover:shadow-[var(--primary)]/20'
          }
        `}
      >
        <LayoutGrid size={18} strokeWidth={2.2} />
        <span>Каталог</span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-70"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </motion.span>
      </button>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile Backdrop */}
            <motion.div

  initial={{ opacity: 0 }}

  animate={{ opacity: 1 }}

  exit={{ opacity: 0 }}

  className="fixed inset-0 z-[90] lg:hidden"

  onClick={close}

/>

            {/* Outer container */}
            <div
              className="fixed z-[100]"
              style={{
                top: menuTop,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '95vw',
                maxWidth: '1280px',
              }}
            >
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                className="
                  bg-white
                  rounded-3xl
                  border border-[var(--border)]
                  shadow-2xl shadow-black/10
                  overflow-hidden
                  lg:max-h-none
                  max-h-[calc(100dvh-var(--menu-top,80px)-16px)]
                  flex flex-col
                "
                style={{
                  transformOrigin: 'top center',
                  '--menu-top': `${menuTop}px`,
                } as React.CSSProperties}
              >
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--border-light)]">
                  <div className="font-semibold text-lg">Каталог</div>
                  <button onClick={close} className="p-2 -mr-2">
                    <X size={22} />
                  </button>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-6 lg:p-10 touch-pan-y">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
                    {items.map((item) => {
                      const hasGroups = item.groups.length > 0
                      return (
                        <div key={item.category.id} className="flex flex-col">
                          <div className="mb-4">
                            <Link
                              href={`/catalog/${item.category.slug}`}
                              onClick={close}
                              className="font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors text-lg tracking-tight block"
                            >
                              {item.category.name}
                            </Link>
                            {item.category.description && (
                              <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                                {item.category.description}
                              </p>
                            )}
                          </div>

                          {hasGroups ? (
                            <ul className="space-y-1 text-sm">
                              {item.groups.map((group) => (
                                <li key={group}>
                                  <Link
                                    href={`/catalog/${item.category.slug}?group=${encodeURIComponent(group)}`}
                                    onClick={close}
                                    className="block py-1.5 px-2 -mx-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition-all"
                                  >
                                    {capitalize(group)}
                                  </Link>
                                </li>
                              ))}
                              <li className="pt-2">
                                <Link
                                  href={`/catalog/${item.category.slug}`}
                                  onClick={close}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                                >
                                  Все товары категории
                                  <ChevronRight size={13} />
                                </Link>
                              </li>
                            </ul>
                          ) : (
                            <Link
                              href={`/catalog/${item.category.slug}`}
                              onClick={close}
                              className="text-[var(--primary)] font-medium inline-flex items-center gap-2 mt-2 group"
                            >
                              Перейти в раздел
                              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition" />
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="border-t border-[var(--border-light)] bg-[var(--surface)] px-6 py-4 flex justify-center">
                  <Link
                    href="/catalog"
                    onClick={close}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] font-medium text-sm transition-all"
                  >
                    <LayoutGrid size={17} />
                    Посмотреть весь каталог
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}