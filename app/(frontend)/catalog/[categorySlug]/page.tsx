import { Column, Heading, Meta, Row, Schema, Text } from "@once-ui-system/core";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GroupFilters } from "@/components/products/GroupFilters";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import { Category } from "@/payload-types";
import { baseURL } from "@/resources/content";
import { getCachedCategoryBySlug } from "@/services/payload/categories";
import {
  getCachedProductGroups,
  getCachedProducts,
} from "@/services/payload/products";

interface Props {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<{ group?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { categorySlug: slug } = await params;
  const { group } = await searchParams;
  const category = await getCachedCategoryBySlug(slug)();

  if (!category)
    return Meta.generate({
      title: "Категория не найдена",
      baseURL,
      description: "",
    });

  return {
    ...(await Meta.generate({
      title: category.name,
      description: `Товары категории "${category.name}"`,
      baseURL,
      path: `/catalog/${slug}`,
      image: `/api/og?title=${encodeURIComponent(category.name)}`,
    })),
    alternates: { canonical: `${baseURL}/catalog/${slug}` },
    robots: group
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: Props) {
  const { categorySlug: slug } = await params;
  const { group } = await searchParams;

  const getCategory = getCachedCategoryBySlug(slug);
  const category = await getCategory();

  if (!category) notFound();

  const groups = await getCachedProductGroups(category.id)();
  const productsData = await getCachedProducts({
    category: category.id,
    group: group || undefined,
    limit: 100,
    sort: "order",
  })();

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Главная", href: "/" },
    { title: "Каталог", href: "/catalog" },
    { title: category.name, href: `/catalog/${slug}` },
  ];

  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/catalog/${slug}`}
        title={category.name}
        description={`Товары категории ${category.name}`}
        image={`/api/og/generate?title=${encodeURIComponent(category.name)}`}
      />
      <BreadcrumbJsonLd siteUrl={baseURL} items={breadcrumbItems} />
      <Breadcrumbs items={breadcrumbItems} />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          <Heading variant="display-strong-l" as="h1" wrap="balance">
            {category.name}
          </Heading>
          {/* {category.description && (
            <Text
              variant="heading-default-xl"
              onBackground="neutral-weak"
              wrap="balance"
              className="mt-4"
            >
              {category.description}
            </Text>
          )} */}
        </Column>
      </Column>

      {/* Фильтры по группам */}
      {groups.length > 0 && (
        <Row fillWidth paddingY="4" horizontal="center">
          <GroupFilters
            groups={groups}
            activeGroup={group}
            categorySlug={slug}
          />
        </Row>
      )}

      {/* Сетка товаров */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-neutral-weak">
            Загрузка товаров...
          </div>
        }
      >
        <ProductsGrid
          products={productsData.docs}
          total={productsData.totalDocs}
          emptyMessage={`В категории "${category.name}"${group ? ` в группе "${group}"` : ""} пока нет товаров`}
        />
      </Suspense>
    </Column>
  );
}
