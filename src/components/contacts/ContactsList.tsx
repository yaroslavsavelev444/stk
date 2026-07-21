import { Flex, Text } from "@once-ui-system/core";
import type { Setting } from "@/payload-types";

type Contact = NonNullable<Setting["contacts"]>[number];
type Manager = NonNullable<Setting["managers"]>[number];

export const ContactsList = ({
  contacts = [],
  companyEmail,
  managers = [],
}: {
  contacts?: Contact[];
  companyEmail?: string | null;
  managers?: Manager[];
}) => {
  const sortedManagers = [...managers].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <Flex wrap gap="l" className="mt-4">
      {/* Общая почта организации */}
      {companyEmail && (
        <Flex direction="column" gap="xs" className="min-w-[200px]">
          <Text variant="body-default-s" color="secondary">
            Общая почта
          </Text>

          <a
            href={`mailto:${companyEmail}`}
            className="text-[var(--primary)] hover:underline"
          >
            {companyEmail}
          </a>
        </Flex>
      )}

      {/* Менеджеры */}
      {sortedManagers.map((manager, index) => (
        <Flex
          key={`${manager.email}-${index}`}
          direction="column"
          gap="xs"
          className="min-w-[200px]"
        >
          <Text variant="body-default-s" color="secondary">
            {manager.name}
          </Text>

          <a
            href={`mailto:${manager.email}`}
            className="text-[var(--primary)] hover:underline"
          >
            {manager.email}
          </a>

          <a
            href={`tel:${manager.phone}`}
            className="text-[var(--primary)] hover:underline"
          >
            {manager.phone}
          </a>
        </Flex>
      ))}
    </Flex>
  );
};
