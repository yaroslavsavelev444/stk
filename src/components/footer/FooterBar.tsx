"use client";

import { Row, Column, Text, IconButton, SmartLink, Button } from "@once-ui-system/core";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Row
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      background="surface-secondary" // серый фон (из ваших переменных)
      className={styles.footer}
    >
      <Column
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="24"
        fillWidth
        s={{ paddingX: "12", gap: "16" }}
      >
        {/* Верхняя строка: логотип + ссылки + кнопка наверх */}
        <Row
          fillWidth
          horizontal="between"
          vertical="center"
          s={{ direction: "column", gap: "16", align: "center" }}
        >
          {/* Логотип */}
          <Row gap="8" vertical="center">
            <img
              src="/images/logo.svg" // замените на свой логотип
              alt="СТК-Актив"
              height={40}
              style={{ display: "block" }}
            />
            <Text variant="heading-default-s" weight="strong">
              СТК-Актив
            </Text>
          </Row>

          {/* Быстрые ссылки */}
          <Row gap="24" s={{ gap: "16" }}>
            <SmartLink href="/about" variant="body-default-s" onBackground="neutral-weak">
              О нас
            </SmartLink>
            <SmartLink href="/contacts" variant="body-default-s" onBackground="neutral-weak">
              Контакты
            </SmartLink>
          </Row>

          {/* Кнопка наверх */}
          <IconButton
            icon="arrow-up"
            size="m"
            variant="secondary"
            onClick={scrollToTop}
            aria-label="Наверх"
          />
        </Row>

        {/* Нижняя строка: копирайт и юридические ссылки */}
        <Row
          fillWidth
          horizontal="between"
          vertical="center"
          s={{ direction: "column", gap: "12", align: "center" }}
        >
          <Text variant="body-default-s" onBackground="neutral-strong">
            © {currentYear} СТК-Актив. Все права защищены.
          </Text>
          <Row gap="16" s={{ gap: "12" }}>
            <SmartLink
              href="/terms"
              variant="body-default-s"
              onBackground="neutral-weak"
            >
              Пользовательское соглашение
            </SmartLink>
            <SmartLink
              href="/privacy"
              variant="body-default-s"
              onBackground="neutral-weak"
            >
              Согласие на обработку данных
            </SmartLink>
          </Row>
        </Row>
      </Column>
    </Row>
  );
};