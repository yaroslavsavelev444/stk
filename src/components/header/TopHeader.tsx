"use client";

import { Row, Text, SmartLink } from "@once-ui-system/core";
import { person } from "@/resources/content";

export const TopHeader = () => {
  return (
    <Row
      as="header"
      fillWidth
      paddingX="16"
      paddingY="8"
      background="surface-secondary"
      borderBottom="neutral-alpha-weak"
      horizontal="center"
      position="sticky"
      top="0"
      zIndex={10}
      s={{ paddingX: "12", paddingY: "6" }}
    >
      <Row maxWidth="m" fillWidth horizontal="between" vertical="center">
        {/* Левая часть: телефон и email */}
        <Row gap="16" s={{ gap: "12" }}>
          <Text variant="body-default-s" onBackground="neutral-weak">
            <SmartLink href={`tel:${person.phone}`} variant="body-default-s">
              {person.phone}
            </SmartLink>
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            <SmartLink href={`mailto:${person.email}`} variant="body-default-s">
              {person.email}
            </SmartLink>
          </Text>
        </Row>

        {/* Правая часть: ссылки на страницы */}
        <Row gap="16" s={{ gap: "12" }}>
          <SmartLink href="/about" variant="body-default-s" onBackground="neutral-weak">
            О нас
          </SmartLink>
          <SmartLink href="/contacts" variant="body-default-s" onBackground="neutral-weak">
            Контакты
          </SmartLink>
          <SmartLink href="/catalog" variant="body-default-s" onBackground="neutral-weak">
            Каталог
          </SmartLink>
        </Row>
      </Row>
    </Row>
  );
};