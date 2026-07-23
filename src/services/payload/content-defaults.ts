// src/services/payload/content-defaults.ts
//
// Резервный контент на случай, если глобал ещё не заполнен через админку
// (сид не запускали) или отдельная секция была удалена редактором — страницы
// не должны падать или показывать пустоту. Источник копирайта — тот же,
// что использовался в коде раньше (src/resources/content.tsx), поэтому
// значения по умолчанию совпадают с текущей версткой один в один.
import type { AboutContent, HomeContent } from "@/payload-types";
// Импортируем из about-content-source.ts (обычный .ts, без JSX), а не из
// content.tsx напрямую: этот файл (через seed-скрипт scripts/seed-content.ts)
// должен уметь загружаться инструментами запуска отдельных TS-файлов
// (ts-node/tsx) вне сборки Next.js, а .tsx с JSX-выражениями такие
// инструменты не транспилируют без дополнительной настройки.
import {
  aboutCalloutSource,
  aboutDirectionsSource,
  aboutGeographySource,
  aboutHeroSource,
  aboutMediaBlocksSource,
  aboutProductionSource,
  aboutProductionWaterSource,
  aboutQualitySource,
  aboutStandardsSource,
  aboutTimelineSource,
  homeAboutIntroSource,
} from "../../resources/about-content-source.ts";

type NonNull<T> = NonNullable<T>;

export const homeContentDefaults: {
  aboutIntro: NonNull<HomeContent["aboutIntro"]>;
  featureCards: NonNull<HomeContent["featureCards"]>;
} = {
  aboutIntro: {
    eyebrow: homeAboutIntroSource.eyebrow,
    heading: homeAboutIntroSource.heading as string,
    lead: homeAboutIntroSource.lead,
    imageAlt: homeAboutIntroSource.heroImageAlt,
  },
  // Блок карточек — новый, исторического контента для него нет: если
  // в CMS ничего не настроено, блок просто не рендерится (см. CertificatesSection
  // для того же паттерна "нет данных — секции нет").
  featureCards: [],
};

export const aboutContentDefaults: {
  hero: NonNull<AboutContent["hero"]>;
  mediaBlocks: NonNull<AboutContent["mediaBlocks"]>;
  callout: NonNull<AboutContent["callout"]>;
  production: NonNull<AboutContent["production"]>;
  productionWater: NonNull<AboutContent["productionWater"]>;
  standards: NonNull<AboutContent["standards"]>;
  quality: NonNull<AboutContent["quality"]>;
  geography: NonNull<AboutContent["geography"]>;
  timeline: NonNull<AboutContent["timeline"]>;
  directions: NonNull<AboutContent["directions"]>;
} = {
  hero: {
    eyebrow: aboutHeroSource.eyebrow,
    heading: aboutHeroSource.heading as string,
    lead: aboutHeroSource.lead,
    imageAlt: aboutHeroSource.heroImageAlt,
  },
  mediaBlocks: aboutMediaBlocksSource.map((block) => ({
    eyebrow: block.eyebrow,
    heading: block.heading as string,
    paragraphs: block.paragraphs.map((text) => ({ text })),
    images: block.images.map((image) => ({ alt: image.alt })),
  })),
  callout: { text: aboutCalloutSource.text },
  production: {
    heading: aboutProductionSource.heading,
    subheading: aboutProductionSource.subheading,
    steps: aboutProductionSource.steps.map((step) => ({ ...step })),
  },
  productionWater: {
    heading: aboutProductionWaterSource.heading,
    subheading: aboutProductionWaterSource.subheading,
    steps: aboutProductionWaterSource.steps.map((step) => ({ ...step })),
  },
  directions: {
    heading: aboutDirectionsSource.heading,
    items: aboutDirectionsSource.items.map((item) => ({
      title: item.title,
      description: item.description,
      href: item.href,
      alt: item.alt ?? item.title,
    })),
  },
  standards: {
    heading: aboutStandardsSource.heading,
    paragraphs: aboutStandardsSource.paragraphs.map((text) => ({ text })),
    materials: aboutStandardsSource.materials.map((material) => ({
      ...material,
    })),
    filmBrands: aboutStandardsSource.filmBrands.map((name) => ({ name })),
  },
  quality: {
    heading: aboutQualitySource.heading,
    subheading: aboutQualitySource.subheading,
    checks: aboutQualitySource.checks.map((check) => ({ ...check })),
  },
  geography: {
    heading: aboutGeographySource.heading,
    subheading: aboutGeographySource.subheading,
    regionsCount: aboutGeographySource.regionsCount,
    routes: aboutGeographySource.routes.map((route) => ({ ...route })),
  },
  timeline: {
    heading: aboutTimelineSource.heading,
    subheading: aboutTimelineSource.subheading,
    events: aboutTimelineSource.events.map((event) => ({ ...event })),
  },
};
