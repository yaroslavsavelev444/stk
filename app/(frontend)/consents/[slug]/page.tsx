// app/(frontend)/consents/[slug]/page.tsx

import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import { ConsentContent, ConsentDocumentDownload } from "@/modules/consents";
import { baseURL } from "@/resources/content";
import { getCachedConsentBySlug } from "@/services/payload/consents";

type ConsentPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ConsentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const consent = await getCachedConsentBySlug(slug)();

  if (!consent) {
    return { title: "Соглашение не найдено" };
  }

  const seo = consent.seo as
    | { title?: string; description?: string }
    | undefined;

  return Meta.generate({
    title: seo?.title || consent.title,
    description: seo?.description || consent.excerpt || consent.title,
    baseURL,
    path: `/consents/${slug}`,
    image: "/og/consents.jpg",
  });
}

export default async function ConsentPage({ params }: ConsentPageProps) {
  const { slug } = await params;
  const consent = await getCachedConsentBySlug(slug)();

  if (!consent) {
    return notFound();
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Главная", href: "/" },
    { title: "Соглашения", href: "/consents" },
    { title: consent.title, href: `/consents/${slug}` },
  ];

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/consents/${slug}`}
        title={consent.title}
        description={consent.excerpt || consent.title}
      />
      <BreadcrumbJsonLd siteUrl={baseURL} items={breadcrumbItems} />

      <Column fillWidth gap="m">
        <Breadcrumbs items={breadcrumbItems} />

        <Column gap="s">
          <Heading variant="display-strong-s" as="h1">
            {consent.title}
          </Heading>

          <ConsentDocumentDownload
            url={consent.documentUrl}
            label={consent.documentLabel}
          />
        </Column>
      </Column>

      <ConsentContent consent={consent} />
    </Column>
  );
}
