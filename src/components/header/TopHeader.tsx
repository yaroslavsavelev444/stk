"use client";

import { Row, Text } from "@once-ui-system/core";
import { person } from "@/resources/content";
import { SearchButton } from "../search/SearchButton";

export const TopHeader = () => {
  return (
    <Row
      as="header"
      fillWidth
      paddingX="16"
      paddingY="8"
      // Убираем невалидный background, используем Tailwind-класс
      className="bg-surface-secondary border-b border-border"
      horizontal="center"
      position="sticky"
      top="0"
      zIndex={10}
    >
      <Row
        maxWidth="m"
        fillWidth
        horizontal="between"
        vertical="center"
        // Адаптивность через Tailwind
        className="flex-col sm:flex-row gap-4 sm:gap-0"
      >
        {/* Левая часть: телефон и email */}
        <Row gap="16" className="flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
          <Text variant="body-default-s" onBackground="neutral-weak">
            <Text as="a" href={`tel:${person.phone}`} variant="body-default-s">
              {person.phone}
            </Text>
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            <Text as="a" href={`mailto:${person.email}`} variant="body-default-s">
              {person.email}
            </Text>
          </Text>
        </Row>
 <SearchButton />
        {/* Правая часть: ссылки на страницы */}
        <Row gap="16" className="flex-wrap justify-center sm:justify-end gap-3 sm:gap-4">
          <Text as="a" href="/about" variant="body-default-s" onBackground="neutral-weak">
            О нас
          </Text>
          <Text as="a" href="/contacts" variant="body-default-s" onBackground="neutral-weak">
            Контакты
          </Text>
          <Text as="a" href="/catalog" variant="body-default-s" onBackground="neutral-weak">
            Каталог
          </Text>
        </Row>
      </Row>
    </Row>
  );
};