import { Flex, Text } from '@once-ui-system/core'
import React from 'react'
import type { Setting } from '@/payload-types'

type Contact = NonNullable<Setting['contacts']>[number]

export const ContactsList = ({ contacts }: { contacts: Contact[] }) => {
  // Сортировка по полю order (оно есть только у contacts)
  const sorted = [...contacts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <Flex wrap={true} gap="l" className="mt-4">
      {sorted.map((contact, index) => (
        <Flex key={index} direction="column" gap="xs" className="min-w-[200px]">
          <Text variant="body-default-s" color="secondary">
            {contact.title}
          </Text>
          {contact.type === 'email' ? (
            <a href={`mailto:${contact.value}`} className="text-[var(--primary)] hover:underline">
              {contact.value}
            </a>
          ) : contact.type === 'phone' ? (
            <a href={`tel:${contact.value}`} className="text-[var(--primary)] hover:underline">
              {contact.value}
            </a>
          ) : contact.type === 'link' ? (
            <a href={contact.value} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
              {contact.value}
            </a>
          ) : (
            <Text>{contact.value}</Text>
          )}
        </Flex>
      ))}
    </Flex>
  )
}