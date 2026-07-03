import { Column, Meta, Schema } from "@once-ui-system/core";
import { CallbackSection } from "@/components/callback-form/CallbackSection";
import { CategoriesGrid } from "@/components/categories";
import { HeroSection } from "@/components/hero/HeroSection";
import Block from "@/components/UI/Block/Block";
import { Reveal } from "@/components/UI/Reveal/Reveal";
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
import { about, aboutPage, baseURL, home, person } from "@/resources/content";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="0" paddingY="0" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Герой сразу, но можно и через Reveal с translateY=24 */}
      <Reveal translateY={24} fillWidth delay={0.1}>
        <HeroSection />
      </Reveal>

      <div id="main-content" />
      <div className="flex flex-col gap-16 md:gap-24 w-full pb-16 md:pb-24">
        <Reveal translateY={16} fillWidth>
          <AboutHero hero={aboutPage.hero} />
        </Reveal>

        {aboutPage.mediaBlocks.map((block, index) => (
          <Reveal key={index} translateY={18} fillWidth delay={index * 0.05}>
            <AboutMediaShowcase block={block} reverse={index % 2 === 1} />
          </Reveal>
        ))}

        <Reveal translateY={10} scale={0.98} fillWidth>
          <AboutCallout text={aboutPage.callout.text} />
        </Reveal>

        <Reveal translateY={12} fillWidth>
          <AboutStats stats={aboutPage.stats} />
        </Reveal>

        <Reveal translateY={16} fillWidth>
          <AboutStandards standards={aboutPage.standards} />
        </Reveal>

        <Reveal translateY={30} fillWidth>
          <AboutTimeline
            heading={aboutPage.timeline.heading}
            subheading={aboutPage.timeline.subheading}
            events={aboutPage.timeline.events}
          />
        </Reveal>

        <Reveal translateY={16} fillWidth>
          <AboutDirections
            heading={aboutPage.directions.heading}
            items={aboutPage.directions.items}
          />
        </Reveal>

        <Reveal translateY={16} fillWidth>
          <AboutCertificates
            heading={aboutPage.certificates.heading}
            subheading={aboutPage.certificates.subheading}
            items={aboutPage.certificates.items}
          />
        </Reveal>

        <Reveal translateY={16} fillWidth delay={0.15}>
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
        </Reveal>
      </div>

      <Reveal translateY={16} fillWidth delay={0.2}>
        <Block variant="ghost" size="xl" title="Каталог" noPadding fullWidth>
          <CategoriesGrid />
        </Block>
      </Reveal>
    </Column>
  );
}
