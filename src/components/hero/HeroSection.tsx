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

export function HeroSection() {
  return (
    // Полноэкранная секция — flex-колонка, контент сдвинут чуть выше центра
    <section className="w-full min-h-svh flex flex-col items-center justify-center pt-16 pb-8 px-6 md:px-8">
      <div
        className="w-full flex flex-col items-center text-center"
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
          <Heading wrap="balance" variant="display-strong-l" align="center">
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