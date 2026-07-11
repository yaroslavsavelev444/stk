'use client';

import {
  Heading,
  Text,
  RevealFx,
  Column,
  Badge,
  Row,
} from "@once-ui-system/core";
import { home } from "@/resources/content";
import { HeroButtons } from "./HeroButtons";
import { HeroMediaBackground } from "./HeroMediaBackground";
import { resolveHeroMedia, type HeroBackgroundSetting } from "./resolveHeroMedia";

interface HeroSectionProps {
  heroBackground?: HeroBackgroundSetting;
}

export function HeroSection({ heroBackground }: HeroSectionProps) {
  const { imageUrl, videoUrl, posterUrl, hasMedia } = resolveHeroMedia(heroBackground);
  // Поверх медиа текст всегда светлый — так читаемость не зависит от темы сайта
  const onMediaTextStyle = hasMedia ? { color: "#fff" } : undefined;
  const onMediaBadgeStyle = hasMedia
    ? { color: "#fff", backgroundColor: "rgba(255, 255, 255, 0.16)" }
    : undefined;

  return (
    // Полноэкранная секция — flex-колонка, контент сдвинут чуть выше центра.
    // Секция лежит внутри `<main>` (padding="l") и `<Column maxWidth="m">`,
    // поэтому обычный w-full/100% не даёт настоящий full-bleed на весь вьюпорт.
    // width:100vw + margin: calc(50% - 50vw) — стандартный приём "full-bleed",
    // который выбивает секцию за пределы центрированного контейнера независимо
    // от его ширины. marginTop/paddingTop компенсируют HeaderSpacer и padding
    // родителя, используя те же CSS-переменные, что и сам layout — поэтому
    // расчёт остаётся верным на всех брейкпоинтах (--responsive-space-l меняется
    // в layout.tsx точно так же).
    <section
      className="relative min-h-svh flex flex-col items-center justify-center pb-8 px-6 md:px-8 overflow-hidden"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        marginTop:
          "calc(-1 * (var(--sticky-header-height) + var(--responsive-space-l)))",
        paddingTop:
          "calc(var(--sticky-header-height) + var(--responsive-space-l) + 1rem)",
      }}
    >
      <HeroMediaBackground imageUrl={imageUrl} videoUrl={videoUrl} posterUrl={posterUrl} />

      <div
        className="relative z-10 w-full flex flex-col items-center text-center"
        style={{ maxWidth: 960, marginTop: '-10vh' }} // ← сдвиг чуть выше центра
      >
        {/* Тег / Badge */}
        {home.featured.display && (
          <RevealFx
            fillWidth
            horizontal="center"
            paddingBottom="24"
            trigger={true}
            delay={0}
            translateY="12"   // сверху вниз
          >
            <Badge
              background="brand-alpha-weak"
              paddingX="12"
              paddingY="4"
              onBackground="neutral-strong"
              textVariant="label-default-s"
              arrow={false}
              href={home.featured.href}
              style={onMediaBadgeStyle}
            >
              <Row paddingY="2">{home.featured.title}</Row>
            </Badge>
          </RevealFx>
        )}

        {/* Заголовок */}
        <RevealFx
          translateY="16"
          fillWidth
          horizontal="center"
          paddingBottom="20"
          trigger={true}
          delay={0.1}
        >
          <Heading
            wrap="balance"
            variant="display-strong-l"
            align="center"
            style={onMediaTextStyle}
          >
            {home.headline}
          </Heading>
        </RevealFx>

        {/* Описание */}
        <RevealFx
          translateY="16"
          fillWidth
          horizontal="center"
          paddingBottom="48"
          trigger={true}
          delay={0.2}
        >
          <Text
            wrap="balance"
            onBackground="neutral-weak"
            variant="heading-default-xl"
            align="center"
            style={onMediaTextStyle}
          >
            {home.subline}
          </Text>
        </RevealFx>

        {/* Кнопки */}
        <RevealFx
          horizontal="center"
          trigger={true}
          delay={0.32}
          translateY="16"
        >
          <HeroButtons />
        </RevealFx>
      </div>
    </section>
  );
}