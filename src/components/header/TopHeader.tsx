import { Row, Text } from '@once-ui-system/core';
import { getPrimaryPhone, getPrimaryEmail } from '@/utils/settings-helpers';
import { getCachedSettings } from '@/services/payload';

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
      className="bg-surface-secondary border-b border-border"
      horizontal="center"
      // Без position:sticky — уходит при скролле
    >
      <Row
        maxWidth="m"
        fillWidth
        horizontal="between"
        vertical="center"
        className="flex-col sm:flex-row gap-4 sm:gap-0"
      >
        {/* Контакты */}
        <Row gap="16" className="flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
          {phone && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              <Text as="a" href={`tel:${phone}`} variant="body-default-s">
                {phone}
              </Text>
            </Text>
          )}
          {email && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              <Text as="a" href={`mailto:${email}`} variant="body-default-s">
                {email}
              </Text>
            </Text>
          )}
        </Row>

        {/* Ссылки */}
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