// src/services/payload/content.ts
import { unstable_cache } from "next/cache";
import type { AboutContent, HomeContent, Media } from "@/payload-types";
import { aboutContentDefaults, homeContentDefaults } from "./content-defaults";
import { getPayloadInstance } from "./getPayload";

async function fetchHomeContent(): Promise<HomeContent | null> {
  const payload = await getPayloadInstance();
  const result = await payload.findGlobal({ slug: "home-content", depth: 1 });
  return (result as HomeContent) ?? null;
}

// В development отключаем кэш, чтобы видеть изменения на лету (тот же
// паттерн, что и в остальных services/payload/*).
export const getCachedHomeContent =
  process.env.NODE_ENV === "development"
    ? fetchHomeContent
    : unstable_cache(fetchHomeContent, ["home-content"], {
        tags: ["home-content"],
        revalidate: false,
      });

async function fetchAboutContent(): Promise<AboutContent | null> {
  const payload = await getPayloadInstance();
  const result = await payload.findGlobal({ slug: "about-content", depth: 1 });
  return (result as AboutContent) ?? null;
}

export const getCachedAboutContent =
  process.env.NODE_ENV === "development"
    ? fetchAboutContent
    : unstable_cache(fetchAboutContent, ["about-content"], {
        tags: ["about-content"],
        revalidate: false,
      });

export interface HomeAboutIntroContent {
  eyebrow: string;
  heading: string;
  lead: string;
  image: Media | null;
  imageAlt: string;
}

export type HomeFeatureCard = NonNullable<HomeContent["featureCards"]>[number];

/**
 * Блок "О компании" на главной. Резолвит секцию из CMS с фолбэком на
 * дефолтный контент (см. content-defaults.ts), чтобы отсутствие/удаление
 * записи в админке не ломало главную страницу.
 */
export async function getHomeAboutIntro(): Promise<HomeAboutIntroContent> {
  const content = await getCachedHomeContent();
  const intro = content?.aboutIntro ?? homeContentDefaults.aboutIntro;
  const image = typeof intro.image === "object" && intro.image ? intro.image : null;

  return {
    eyebrow: intro.eyebrow,
    heading: intro.heading,
    lead: intro.lead,
    image,
    imageAlt: intro.imageAlt,
  };
}

/** Карточки блока преимуществ перед "Почему выбирают СТК-Актив". */
export async function getHomeFeatureCards(): Promise<HomeFeatureCard[]> {
  const content = await getCachedHomeContent();
  const cards = content?.featureCards;
  return Array.isArray(cards) && cards.length > 0 ? cards : (homeContentDefaults.featureCards ?? []);
}

export interface AboutPageSections {
  hero: NonNullable<AboutContent["hero"]>;
  mediaBlocks: NonNullable<AboutContent["mediaBlocks"]>;
  callout: NonNullable<AboutContent["callout"]>;
  production: NonNullable<AboutContent["production"]>;
  productionWater: NonNullable<AboutContent["productionWater"]>;
  standards: NonNullable<AboutContent["standards"]>;
  quality: NonNullable<AboutContent["quality"]>;
  geography: NonNullable<AboutContent["geography"]>;
  timeline: NonNullable<AboutContent["timeline"]>;
}

/**
 * Контент страницы "О нас" (диапазон от блока "О компании" до "История
 * компании"). Фолбэк применяется по каждой секции отдельно: если раздел
 * не задан или был удалён в админке, страница показывает дефолтный текст
 * вместо падения/пустоты.
 */
export async function getAboutContent(): Promise<AboutPageSections> {
  const content = await getCachedAboutContent();

  return {
    hero: content?.hero ?? aboutContentDefaults.hero,
    mediaBlocks:
      content?.mediaBlocks && content.mediaBlocks.length > 0
        ? content.mediaBlocks
        : aboutContentDefaults.mediaBlocks,
    callout: content?.callout ?? aboutContentDefaults.callout,
    production: content?.production ?? aboutContentDefaults.production,
    productionWater: content?.productionWater ?? aboutContentDefaults.productionWater,
    standards: content?.standards ?? aboutContentDefaults.standards,
    quality: content?.quality ?? aboutContentDefaults.quality,
    geography: content?.geography ?? aboutContentDefaults.geography,
    timeline: content?.timeline ?? aboutContentDefaults.timeline,
  };
}
