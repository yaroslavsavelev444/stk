import type { Media } from "@/payload-types";
import type {
  AboutPageSections,
  HomeAboutIntroContent,
} from "@/services/payload/content";
import type {
  AboutDirectionsContent,
  AboutGeographyContent,
  AboutHeroContent,
  AboutMediaBlock,
  AboutStandardsContent,
} from "../types";

function resolveMedia(media?: (string | null) | Media | null): Media | null {
  return typeof media === "object" && media ? media : null;
}

/** "О компании" на главной и hero страницы "О нас" используют один и тот же
 * компонент AboutHero — общий маппер избавляет от дублирования. */
export function mapIntroToHero(intro: {
  eyebrow: string;
  heading: string;
  lead: string;
  image?: (string | null) | Media | null;
  imageAlt: string;
}): AboutHeroContent {
  return {
    eyebrow: intro.eyebrow,
    heading: intro.heading,
    lead: intro.lead,
    heroImageAlt: intro.imageAlt,
    heroImage: resolveMedia(intro.image),
  };
}

export function mapHomeAboutIntro(
  intro: HomeAboutIntroContent,
): AboutHeroContent {
  return mapIntroToHero(intro);
}

export function mapAboutMediaBlocks(
  blocks: AboutPageSections["mediaBlocks"],
): AboutMediaBlock[] {
  return blocks.map((block) => ({
    eyebrow: block.eyebrow ?? undefined,
    heading: block.heading,
    paragraphs: (block.paragraphs ?? []).map((paragraph) => paragraph.text),
    images: (block.images ?? []).map((item) => ({
      image: resolveMedia(item.image),
      alt: item.alt,
    })),
  }));
}

export function mapAboutDirections(
  directions: AboutPageSections["directions"],
): AboutDirectionsContent {
  return {
    heading: directions.heading,

    items: (directions.items ?? []).map((item) => ({
      title: item.title,
      description: item.description,
      href: item.href,
      image: resolveMedia(item.image),
      alt: item.alt,
    })),
  };
}

export function mapAboutStandards(
  standards: AboutPageSections["standards"],
): AboutStandardsContent {
  return {
    heading: standards.heading,
    paragraphs: (standards.paragraphs ?? []).map((paragraph) => paragraph.text),
    materials: (standards.materials ?? []).map((material) => ({
      title: material.title,
      description: material.description,
    })),
    filmBrands: (standards.filmBrands ?? []).map((brand) => brand.name),
  };
}

export function mapAboutGeography(
  geography: AboutPageSections["geography"],
): AboutGeographyContent {
  return {
    heading: geography.heading,
    subheading: geography.subheading,
    regionsCount: geography.regionsCount,
    routes: (geography.routes ?? []).map((route) => ({
      name: route.name,
      description: route.description,
    })),
    image: resolveMedia(geography.image),
  };
}
