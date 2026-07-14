// app/(frontend)/consents/page.tsx
import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import { ConsentsList } from "@/modules/consents";
import { baseURL } from "@/resources/content";

const breadcrumbItems: BreadcrumbItem[] = [
  { title: "Главная", href: "/" },
  { title: "Соглашения", href: "/consents" },
];

export async function generateMetadata() {
  return Meta.generate({
    title: "Соглашения",
    description:
      "Пользовательские соглашения и документы о согласии на обработку данных.",
    baseURL,
    path: "/consents",
    image: "/og/consents.jpg",
  });
}

export default function ConsentsPage() {
  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/consents"
        title="Соглашения"
        description="Пользовательские соглашения и документы о согласии на обработку данных"
      />

      <BreadcrumbJsonLd siteUrl={baseURL} items={breadcrumbItems} />

      <Column fillWidth gap="m">
        <Breadcrumbs items={breadcrumbItems} />

        <Column gap="xs">
          <Heading variant="display-strong-s" as="h1">
            Соглашения
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Документы, регулирующие использование сайта и обработку персональных
            данных.
          </Text>
        </Column>
      </Column>

      <ConsentsList />
    </Column>
  );
}
