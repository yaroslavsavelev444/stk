import { Row, Text } from "@once-ui-system/core";
import type { Consent } from "@/payload-types";
import styles from "./Footer.module.scss";

interface FooterLegalLinksProps {
  consents: Consent[];
}

/**
 * Чисто презентационный компонент: строит ссылки на страницы соглашений
 * из уже загруженных данных. Не знает о Payload, кэшировании или сервисах —
 * получает готовый массив Consent[] и просто рендерит.
 *
 * Ничего не выводит, если активных соглашений нет — так футер не показывает
 * пустой/сломанный ряд ссылок.
 */
export function FooterLegalLinks({ consents }: FooterLegalLinksProps) {
  if (consents.length === 0) return null;

  return (
    <Row gap="16" wrap className={styles.legalLinks}>
      {consents.map((consent) => (
        <Text
          key={consent.id}
          as="a"
          href={`/consents/${consent.slug}`}
          variant="body-default-s"
        >
          {consent.title}
        </Text>
      ))}
    </Row>
  );
}
