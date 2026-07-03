import { Column, Meta, Schema } from "@once-ui-system/core";
import { CallbackSection } from "@/components/callback-form/CallbackSection";
import { AutoBreadcrumbs } from "@/components/UI/Breadcrumbs/AutoBreadcrumbs";
import {
  AboutCallout,
  AboutCertificates,
  AboutDirections,
  AboutHero,
  AboutMediaShowcase,
  AboutStandards,
  AboutStats,
  AboutTimeline,
} from "@/modules/about";
import { aboutPage, baseURL } from "@/resources/content";

export async function generateMetadata() {
  return Meta.generate({
    title: aboutPage.seo.title,
    description: aboutPage.seo.description,
    baseURL,
    path: aboutPage.path,
    image: "/og/about.jpg",
  });
}

export default function AboutPage() {
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

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <AutoBreadcrumbs />
      </div>

      <div className="flex flex-col gap-16 md:gap-24 w-full pb-16 md:pb-24">
        <AboutHero hero={aboutPage.hero} />

        {aboutPage.mediaBlocks.map((block, index) => (
          <AboutMediaShowcase
            key={index}
            block={block}
            reverse={index % 2 === 1}
          />
        ))}

        <AboutCallout text={aboutPage.callout.text} />

        <AboutStats stats={aboutPage.stats} />

        <AboutStandards standards={aboutPage.standards} />

        <AboutTimeline
          heading={aboutPage.timeline.heading}
          subheading={aboutPage.timeline.subheading}
          events={aboutPage.timeline.events}
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
