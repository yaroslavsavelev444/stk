import type { Media } from "@/payload-types";

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutMediaImage {
  /** Реальное изображение из медиабиблиотеки. Если не задано — заглушка. */
  image?: Media | null;
  alt: string;
}

export interface AboutMediaBlock {
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  images: AboutMediaImage[];
}

export interface AboutHeroContent {
  eyebrow: string;
  heading: string;
  lead: string;
  heroImageAlt: string;
  /** Реальное изображение из медиабиблиотеки. Если не задано — заглушка. */
  heroImage?: Media | null;
}

export interface AboutStandardsContent {
  heading: string;
  paragraphs: string[];
  materials: { title: string; description: string }[];
  filmBrands: string[];
}

export interface AboutTimelineEvent {
  year: string;
  title: string;
  description: string;
  highlight?: string | null;
}

export interface AboutRouteItem {
  name: string;
  description: string;
}

export interface AboutGeographyContent {
  heading: string;
  subheading: string;
  regionsCount: string;
  routes: AboutRouteItem[];
  /** Реальная карта из медиабиблиотеки. Если не задана — изображение по умолчанию. */
  image?: Media | null;
}

export type AboutDirectionItem = {
  title: string;
  description: string;
  href: string;
  image?: Media | null;
  alt?: string;
};

export type AboutDirectionsContent = {
  heading: string;
  items: AboutDirectionItem[];
};

export interface AboutCertificateItem {
  title: string;
  issuer: string;
}

/**
 * Статический контент страницы "О нас", который остаётся в коде (не
 * переехал в Payload): SEO, направления деятельности, награды и CTA.
 * Секции от вступления ("О компании") до "Истории компании" управляются
 * через админку — см. services/payload/content.ts (getAboutContent) и
 * соответствующие AboutHeroContent/AboutMediaBlock/AboutStandardsContent/
 * ProductionStep/QualityCheckItem/AboutGeographyContent/AboutTimelineEvent.
 */
export interface AboutPageContent {
  path: string;
  seo: {
    title: string;
    description: string;
  };
  stats: AboutStat[];
  directions: {
    heading: string;
    items: AboutDirectionItem[];
  };
  certificates: {
    heading: string;
    subheading: string;
    items: AboutCertificateItem[];
  };
  cta: {
    heading: string;
    description: string;
  };
}

export type ProductionStepIcon =
  | "cut"
  | "apply"
  | "assemble"
  | "inspect"
  | "pack";

export interface ProductionStep {
  title: string;
  description: string;
  icon: ProductionStepIcon;
}

export interface QualityCheckItem {
  title: string;
  description: string;
}
