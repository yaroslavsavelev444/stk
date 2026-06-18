'use client' // если используете клиентский компонент, но можно и серверный

import React from 'react'
import type { Setting } from '@/payload-types'

export const OrganizationJsonLd = ({
  settings,
  siteUrl,
}: {
  settings: Setting
  siteUrl: string
}) => {
  const {
    companyName,
    logo,
    workingHours,
    contacts = [],
    socials = [],
  } = settings

  // Контакты только для телефона/email
  const contactPoints = contacts
    .filter(c => c.type === 'phone' || c.type === 'email')
    .map(c => ({
      '@type': 'ContactPoint',
      contactType: c.title,
      telephone: c.type === 'phone' ? c.value : undefined,
      email: c.type === 'email' ? c.value : undefined,
    }))

  // sameAs – все ссылки соцсетей
  const sameAs = socials.map(s => s.url).filter(Boolean)

  // openingHours – если есть, но приводим к формату Schema.org (необязательно)
  // Можно оставить как есть, но это невалидно; лучше не указывать, если не уверены.
  // Оставляем без приведения, чтобы не врать.

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyName || 'STK',
    url: siteUrl,
    ...(logo?.url ? { logo: `${siteUrl}${logo.url}` } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(workingHours ? { openingHours: workingHours } : {}),
    ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}