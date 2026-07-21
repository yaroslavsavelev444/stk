import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import { ContactsList } from "@/components/contacts/ContactsList";
import { MapEmbed } from "@/components/contacts/MapEmbed";
import { SocialLinks } from "@/components/contacts/SocialLinks";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import {
  type BreadcrumbItem,
  Breadcrumbs,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import { getCachedSettings } from "@/services/payload/settings";
import { generateContactsMetadata } from "@/utils/contacts-metadata";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  console.warn(
    "NEXT_PUBLIC_SITE_URL не задан, некоторые SEO-теги будут отсутствовать",
  );
}

const breadcrumbItems: BreadcrumbItem[] = [
  { title: "Главная", href: "/" },
  { title: "Контакты", href: "/contacts" },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings();
  return generateContactsMetadata(settings, siteUrl || "");
}

export default async function ContactsPage() {
  const settings = await getCachedSettings();

  if (!settings) {
    return (
      <Column fillWidth horizontal="center" padding="l">
        <Text>Контакты не найдены</Text>
      </Column>
    );
  }

  const companyName = settings.companyName || "STK";
  // Payload возвращает `null` для незаполненного array-поля, а не только
  // `undefined` — деструктуризация с дефолтом это не ловит, поэтому
  // приводим явно через `??`.
  const socials = settings.socials ?? [];
  const contacts = settings.contacts ?? [];
  const managers = settings.managers ?? [];

  const hasContacts =
    contacts.length > 0 ||
    managers.length > 0 ||
    Boolean(settings.companyEmail);
  const { workingHours, map } = settings;

  return (
    <>
      <OrganizationJsonLd settings={settings} siteUrl={siteUrl || ""} />
      <BreadcrumbJsonLd siteUrl={siteUrl || ""} items={breadcrumbItems} />

      <Column fillWidth horizontal="center" padding="l" gap="l">
        <Flex maxWidth={65} fillWidth direction="column" gap="m">
          <Breadcrumbs items={breadcrumbItems} />

          <Heading variant="display-strong-s" as="h1">
            Контакты {companyName}
          </Heading>

          {hasContacts && (
            <ContactsList
              contacts={settings.contacts ?? []}
              companyEmail={settings.companyEmail}
              managers={settings.managers ?? []}
            />
          )}

          {workingHours && (
            <Flex direction="column" gap="xs">
              <Text variant="body-default-s" color="secondary">
                Часы работы
              </Text>
              <Text>{workingHours}</Text>
            </Flex>
          )}

          {socials.length > 0 && <SocialLinks socials={socials} />}

          <MapEmbed map={map || ""} fullWidth />
        </Flex>
      </Column>
    </>
  );
}
