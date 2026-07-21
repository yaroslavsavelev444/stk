import { Column, Meta, Schema } from "@once-ui-system/core";
import { CallbackSection } from "@/components/callback-form/CallbackSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  type BreadcrumbItem,
  Breadcrumbs,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import {
  AboutCallout,
  AboutCertificates,
  AboutDirections,
  AboutHero,
  AboutMediaShowcase,
  AboutStandards,
  AboutTimeline,
  GeographySection,
  ProductionProcessSection,
  QualityControlSection,
} from "@/modules/about";
import {
  mapAboutGeography,
  mapAboutMediaBlocks,
  mapAboutStandards,
  mapIntroToHero,
} from "@/modules/about/utils/mapAboutContent";
import { aboutPage, baseURL } from "@/resources/content";
import { getAboutContent } from "@/services/payload/content";

const breadcrumbItems: BreadcrumbItem[] = [
  { title: "Главная", href: "/" },
  { title: "О нас", href: aboutPage.path },
];

export async function generateMetadata() {
  return Meta.generate({
    title: aboutPage.seo.title,
    description: aboutPage.seo.description,
    baseURL,
    path: aboutPage.path,
    image: "/og/about.jpg",
  });
}

export default async function AboutPage() {
  const content = await getAboutContent();
  const hero = mapIntroToHero(content.hero);
  const mediaBlocks = mapAboutMediaBlocks(content.mediaBlocks);
  const standards = mapAboutStandards(content.standards);
  const geography = mapAboutGeography(content.geography);

  return (
    <Column maxWidth="m" gap="0" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={aboutPage.path}
        title={aboutPage.seo.title}
        description={aboutPage.seo.description}
        image={`/api/og/generate?title=${encodeURIComponent(aboutPage.seo.title)}`}
      />
      <BreadcrumbJsonLd siteUrl={baseURL} items={breadcrumbItems} />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex flex-col gap-16 md:gap-24 w-full pb-16 md:pb-24">
        <AboutHero hero={hero} />

        {mediaBlocks.map((block, index) => (
          <AboutMediaShowcase
            key={index}
            block={block}
            reverse={index % 2 === 1}
          />
        ))}

        <AboutCallout text={content.callout.text} />

        <ProductionProcessSection
          heading={content.production.heading}
          subheading={content.production.subheading}
          steps={content.production.steps ?? []}
        />
        <ProductionProcessSection
          heading={content.productionWater.heading}
          subheading={content.productionWater.subheading}
          steps={content.productionWater.steps ?? []}
        />

        <AboutStandards standards={standards} />

        <QualityControlSection
          heading={content.quality.heading}
          subheading={content.quality.subheading}
          checks={content.quality.checks ?? []}
          brands={standards.filmBrands}
        />

        <GeographySection
          heading={geography.heading}
          subheading={geography.subheading}
          regionsCount={geography.regionsCount}
          routes={geography.routes}
          image={geography.image}
        />

        <AboutTimeline
          heading={content.timeline.heading}
          subheading={content.timeline.subheading}
          events={content.timeline.events ?? []}
        />

        <AboutDirections
          heading={aboutPage.directions.heading}
          items={aboutPage.directions.items}
        />

        <AboutCertificates
          heading={aboutPage.certificates.heading}
          subheading={aboutPage.certificates.subheading}
          items={aboutPage.certificates.items}
        />

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
              {aboutPage.cta.heading}
            </h2>
            <p className="mx-auto max-w-xl text-[var(--text-secondary)]">
              {aboutPage.cta.description}
            </p>
          </div>
          <CallbackSection />
        </div>
      </div>
    </Column>
  );
}
