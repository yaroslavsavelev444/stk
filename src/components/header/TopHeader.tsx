import { Row, Text } from "@once-ui-system/core";
import { getCachedSettings } from "@/services/payload";
import { getPrimaryEmail, getPrimaryPhone } from "@/utils/settings-helpers";

export const TopHeader = async () => {
  const settings = await getCachedSettings();
  const phone = getPrimaryPhone(settings);
  const email = getPrimaryEmail(settings);

  return (
    <Row
      as="header"
      fillWidth
      paddingX="16"
      paddingY="8"
      className="bg-white/50 backdrop-blur-md"
      horizontal="center"
    >
      <Row
        maxWidth="m"
        fillWidth
        horizontal="between"
        vertical="center"
        className="flex-col sm:flex-row gap-4 sm:gap-0"
      >
        {/* Контакты */}
        <Row
          gap="16"
          className="flex-wrap justify-center sm:justify-start gap-3 sm:gap-4"
        >
          {phone && (
            <Text variant="body-default-m" onBackground="neutral-weak">
              <Text as="a" href={`tel:${phone}`} variant="body-default-m">
                {phone}
              </Text>
            </Text>
          )}
          {email && (
            <Text variant="body-default-m" onBackground="neutral-weak">
              <Text as="a" href={`mailto:${email}`} variant="body-default-m">
                {email}
              </Text>
            </Text>
          )}
        </Row>

        {/* Ссылки */}
        <Row
          gap="16"
          className="flex-wrap justify-center sm:justify-end gap-3 sm:gap-4"
        >
          <Text
            as="a"
            href="/about"
            variant="body-default-m"
            onBackground="neutral-weak"
          >
            О нас
          </Text>
          <Text
            as="a"
            href="/contacts"
            variant="body-default-m"
            onBackground="neutral-weak"
          >
            Контакты
          </Text>
          <Text
            as="a"
            href="/catalog"
            variant="body-default-m"
            onBackground="neutral-weak"
          >
            Каталог
          </Text>
        </Row>
      </Row>
    </Row>
  );
};
