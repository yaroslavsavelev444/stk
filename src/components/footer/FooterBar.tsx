"use client";

import { Row, Column, Text, IconButton } from "@once-ui-system/core";
import Image from "next/image"; // оптимизированное изображение
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
      background="surface"   // можно раскомментировать, если нужен фон
      className={styles.footer}
    >
      <Column
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="24"
        fillWidth
        // адаптивность через CSS-класс (или оставить только padding и gap, если нужно)
        className={styles.column}
      >
        {/* Верхняя строка */}
        <Row
          fillWidth
          horizontal="between"
          vertical="center"
          className={styles.topRow} // адаптивность через CSS
        >
          {/* Логотип */}
          <Row gap="8" vertical="center">
            <Image
              src="/images/logo.png"
              alt="СТК-Актив"
              height={40}
              width={40} // укажите реальную ширину, либо используйте layout="intrinsic"
              style={{ display: "block" }}
            />
            <Text variant="heading-default-s" weight="strong">
              СТК-Актив
            </Text>
          </Row>

          {/* Ссылки */}
          <Row gap="24" className={styles.linksRow}>
            <Text as="a" href="/about" variant="body-default-s">
              О нас
            </Text>
            <Text as="a" href="/contacts" variant="body-default-s">
              Контакты
            </Text>
          </Row>

          {/* Кнопка наверх */}
          <IconButton
            icon="chevron-up"
            size="m"
            variant="secondary"
            onClick={scrollToTop}
            aria-label="Наверх"
          />
        </Row>

        {/* Нижняя строка */}
        <Row
          fillWidth
          horizontal="between"
          vertical="center"
          className={styles.bottomRow} // адаптивность через CSS
        >
          <Text variant="body-default-s" onBackground="neutral-strong">
            © {currentYear} СТК-Актив. Все права защищены.
          </Text>
          <Row gap="16" className={styles.legalLinks}>
            <Text as="a" href="/terms" variant="body-default-s">
              Пользовательское соглашение
            </Text>
            <Text as="a" href="/privacy" variant="body-default-s">
              Согласие на обработку данных
            </Text>
          </Row>
        </Row>
      </Column>
    </Row>
  );
};