import { Column, Row, Text } from "@once-ui-system/core";
import Image from "next/image";
import { getCachedConsents } from "@/services/payload/consents";
import styles from "./Footer.module.scss";
import { FooterLegalLinks } from "./FooterLegalLinks";
import { ScrollToTopButton } from "./ScrollToTopButton";

/**
 * Server Component: тянет опубликованные соглашения через кэширующий
 * сервис (та же стратегия, что и у Categories/Products/Settings —
 * unstable_cache в prod, прямой fetch в dev) и передаёт их в
 * презентационный FooterLegalLinks. Никакой бизнес-логики здесь нет —
 * только композиция.
 */
export const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const consents = await getCachedConsents();

  return (
    <Row
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      background="surface"
      className={styles.footer}
    >
      <Column
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="24"
        fillWidth
        className={styles.column}
      >
        {/* Верхняя строка */}
        <Row
          fillWidth
          horizontal="between"
          vertical="center"
          className={styles.topRow}
        >
          {/* Логотип */}
          <Row gap="8" vertical="center">
            <Image
              src="/images/logo.png"
              alt="СТК-Актив"
              height={40}
              width={40}
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

          {/* Кнопка наверх — единственная интерактивная часть, вынесена в клиентский компонент */}
          <ScrollToTopButton />
        </Row>

        {/* Нижняя строка */}
        <Row
          fillWidth
          horizontal="between"
          vertical="center"
          className={styles.bottomRow}
        >
          <Text variant="body-default-s" onBackground="neutral-strong">
            © {currentYear} СТК-Актив. Все права защищены.
          </Text>

          {/* Соглашения — динамически из Payload, без хардкода /terms и /privacy */}
          <FooterLegalLinks consents={consents} />
        </Row>
      </Column>
    </Row>
  );
};
