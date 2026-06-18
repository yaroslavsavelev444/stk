import { Flex } from '@once-ui-system/core'
import React from 'react'
import type { Setting } from '@/payload-types'

type Social = NonNullable<Setting['socials']>[number]

export const SocialLinks = ({ socials }: { socials: Social[] }) => {
  // Соцсети НЕ имеют order, поэтому выводим как есть (без сортировки)

  const renderIcon = (icon?: string) => {
    if (!icon) return null
    // Если это URL картинки
    if (icon.startsWith('http') || icon.startsWith('/')) {
      return <img src={icon} alt="" className="w-5 h-5 object-contain" />
    }
    // Иначе просто вернём текст (можно обернуть в span), без FontAwesome
    return <span className="text-[var(--text-secondary)]">{icon}</span>
  }

  return (
    <Flex wrap={true} gap="m" className="mt-2">
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
        >
          {renderIcon(social.icon)}
          <span>{social.title || social.url}</span>
        </a>
      ))}
    </Flex>
  )
}