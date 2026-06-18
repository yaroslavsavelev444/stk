import type { Metadata } from 'next'
import type { Setting } from '@/payload-types'

export function generateContactsMetadata(
  settings: Setting | null,
  siteUrl: string
): Metadata {
  const seo = settings?.seo

  return {
    title: seo?.title || 'Контакты | STK',
    description: seo?.description || 'Свяжитесь с нами – мы всегда на связи',
    keywords: seo?.keywords || '',
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    alternates: siteUrl
      ? {
          canonical: `${siteUrl}/contacts`,
        }
      : undefined,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: seo?.title || 'Контакты | STK',
      description: seo?.description || 'Свяжитесь с нами – мы всегда на связи',
      url: siteUrl ? `${siteUrl}/contacts` : undefined,
      siteName: settings?.companyName || 'STK',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || 'Контакты | STK',
      description: seo?.description || 'Свяжитесь с нами – мы всегда на связи',
    },
  }
}