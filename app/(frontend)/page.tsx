import { Column, Meta, Schema } from "@once-ui-system/core";
import { CallbackSection } from "@/components/callback-form/CallbackSection";
import { CategoriesGrid } from "@/components/categories";
import { HeroSection } from "@/components/hero/HeroSection";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import { AboutHero } from "@/modules/about";
import { mapHomeAboutIntro } from "@/modules/about/utils/mapAboutContent";
import { FeatureCards, TrustBar, WhyUsSection } from "@/modules/home";
import { CertificatesSection } from "@/modules/home/components/CertificatesSection";
import { ReviewsSection } from "@/modules/home/components/ReviewsSection";
import { baseURL, home, trustStats, whyUsItems } from "@/resources/content";
import { getCachedSettings, getHomeAboutIntro } from "@/services/payload";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function Home() {
  const settings = await getCachedSettings();
  const aboutIntro = mapHomeAboutIntro(await getHomeAboutIntro());

  return (
    <Column maxWidth="m" gap="0" paddingY="0" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
      />

      {/* Без Reveal: Hero — первый экран, он должен быть виден сразу и
          полностью, а не после срабатывания scroll-in-view анимации. */}
      <HeroSection heroBackground={settings?.heroBackground} />

      <div id="main-content" />

      <div className="flex flex-col gap-16 md:gap-24 w-full pb-16 md:pb-24">
        <Reveal translateY={16} fillWidth>
          <AboutHero hero={aboutIntro} />
        </Reveal>

        {/* Тёмная полоса доверия — контраст между интро и аргументами */}
        <TrustBar stats={trustStats} />

        <Reveal translateY={16} fillWidth>
          <FeatureCards />
        </Reveal>

        <WhyUsSection items={whyUsItems} />

        <Reveal translateY={16} fillWidth delay={0.1}>
          <CategoriesGrid />
        </Reveal>

        <Reveal translateY={16} fillWidth delay={0.1}>
          <CertificatesSection />
        </Reveal>

        <Reveal translateY={16} fillWidth delay={0.1}>
          <ReviewsSection />
        </Reveal>

        <Reveal translateY={16} fillWidth delay={0.15}>
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-8 flex flex-col gap-2 text-center">
              <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-(--text-primary)">
                Обсудим ваш проект?
              </h2>
              <p className="mx-auto max-w-xl text-(--text-secondary)">
                Оставьте заявку — рассчитаем стоимость и сроки поставки в
                течение рабочего дня.
              </p>
            </div>
            <CallbackSection />
          </div>
        </Reveal>
      </div>
    </Column>
  );
}
