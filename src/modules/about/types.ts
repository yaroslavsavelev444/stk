import type { ReactNode } from 'react'

export interface AboutStat {
  value: string
  label: string
}

export interface AboutMediaImage {
  alt: string
  aspect?: string
}

export interface AboutMediaBlock {
  eyebrow?: string
  heading: ReactNode
  paragraphs: string[]
  images: AboutMediaImage[]
}

export interface AboutTimelineEvent {
  year: string
  title: string
  description: string
  highlight?: string
}

export interface AboutDirectionItem {
  title: string
  description: string
  href: string
}

export interface AboutCertificateItem {
  title: string
  issuer: string
}

export interface AboutPageContent {
  path: string
  seo: {
    title: string
    description: string
  }
  hero: {
    eyebrow: string
    heading: ReactNode
    lead: string
    heroImageAlt: string
  }
  mediaBlocks: AboutMediaBlock[]
  callout: {
    text: string
  }
  stats: AboutStat[]
  standards: {
    heading: string
    paragraphs: string[]
    materials: { title: string; description: string }[]
    filmBrands: string[]
  }
  timeline: {
    heading: string
    subheading: string
    events: AboutTimelineEvent[]
  }
  directions: {
    heading: string
    items: AboutDirectionItem[]
  }
  certificates: {
    heading: string
    subheading: string
    items: AboutCertificateItem[]
  }
  cta: {
    heading: string
    description: string
  }
}