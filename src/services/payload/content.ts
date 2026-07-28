// src/services/payload/content.ts
import { unstable_cache } from "next/cache";
import type { WhyUsItem } from "@/modules/home/types";
import type { AboutContent, HomeContent, Media } from "@/payload-types";
import { aboutContentDefaults, homeContentDefaults } from "./content-defaults";
import { getPayloadInstance } from "./getPayload";

async function fetchHomeContent(): Promise<HomeContent | null> {
  const payload = await getPayloadInstance();
  const result = await payload.findGlobal({ slug: "home-content", depth: 1 });
  return (result as HomeContent) ?? null;
}

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

export async function getHomeAboutIntro(): Promise<HomeAboutIntroContent> {
  const content = await getCachedHomeContent();
  const intro = content?.aboutIntro ?? homeContentDefaults.aboutIntro;
  const image =
    typeof intro.image === "object" && intro.image ? intro.image : null;

  return {
    eyebrow: intro.eyebrow,
    heading: intro.heading,
    lead: intro.lead,
    image,
    imageAlt: intro.imageAlt,
  };
}

export async function getHomeFeatureCards(): Promise<HomeFeatureCard[]> {
  const content = await getCachedHomeContent();
  const cards = content?.featureCards;
  return Array.isArray(cards) && cards.length > 0
    ? cards
    : (homeContentDefaults.featureCards ?? []);
}

// ↓ новое: контент секции "Почему выбирают СТК-Актив"
export interface HomeWhyUsContent {
  heading: string;
  subheading: string;
  items: WhyUsItem[];
}

/**
 * Секция "Почему выбирают СТК-Актив" на главной. Как и остальные секции,
 * резолвится из CMS с фолбэком на дефолтный контент (content-defaults.ts).
 * Фолбэк применяется целиком на группу whyUs, а не поэлементно на items —
 * т.к. вёрстка рассчитана ровно на 4 карточки (см. HomeContent.ts), частично
 * заполненный набор из CMS показываем как есть без подмешивания дефолтов.
 */
export async function getHomeWhyUs(): Promise<HomeWhyUsContent> {
  const content = await getCachedHomeContent();
  const whyUs = content?.whyUs ?? homeContentDefaults.whyUs;

  return {
    heading: whyUs.heading,
    subheading: whyUs.subheading,
    items: (whyUs.items ?? []).map((item) => ({
      title: item.title,
      description: item.description,
      icon: item.icon,
    })),
  };
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
  directions: NonNullable<AboutContent["directions"]>;
}

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
    productionWater:
      content?.productionWater ?? aboutContentDefaults.productionWater,
    standards: content?.standards ?? aboutContentDefaults.standards,
    quality: content?.quality ?? aboutContentDefaults.quality,
    geography: content?.geography ?? aboutContentDefaults.geography,
    timeline: content?.timeline ?? aboutContentDefaults.timeline,
    directions: content?.directions ?? aboutContentDefaults.directions,
  };
}
