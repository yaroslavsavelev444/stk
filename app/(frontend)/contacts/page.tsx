import { getCachedSettings } from "@/services/payload/settings";
import { Column, Flex, Heading, Text } from "@once-ui-system/core";
import { ContactsList } from "@/components/contacts/ContactsList";
import { SocialLinks } from "@/components/contacts/SocialLinks";
import { MapEmbed } from "@/components/contacts/MapEmbed";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { BreadcrumbJsonLd } from "@/components/contacts/BreadcrumbJsonLd";
import type { Metadata } from "next";
import { generateContactsMetadata } from "@/utils/contacts-metadata";
import { AutoBreadcrumbs } from "@/components/UI/Breadcrumbs/AutoBreadcrumbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  console.warn(
    "NEXT_PUBLIC_SITE_URL не задан, некоторые SEO-теги будут отсутствовать",
  );
}

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

  const {
    companyName = "STK",
    contacts = [],
    socials = [],
    workingHours,
    map,
  } = settings;

  return (
    <>
      <OrganizationJsonLd settings={settings} siteUrl={siteUrl || ""} />
      <BreadcrumbJsonLd siteUrl={siteUrl || ""} />

      <Column fillWidth horizontal="center" padding="l" gap="l">
        <Flex maxWidth={65} fillWidth direction="column" gap="m">
          <AutoBreadcrumbs />

          <Heading variant="display-strong-s" as="h1">
            Контакты {companyName}
          </Heading>

          {contacts.length > 0 && <ContactsList contacts={contacts} />}

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
          {/* <ContactsPageUsage /> */}
        </Flex>
      </Column>
    </>
  );
}
