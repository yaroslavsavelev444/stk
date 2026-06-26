import {
  Heading,
  Text,
  Column,
  Row,
  Schema,
  Meta,
} from "@once-ui-system/core";
import { baseURL } from "@/resources/content";
import { getCachedCategoryBySlug } from "@/services/payload/categories";
import { getCachedProductGroups, getCachedProducts } from "@/services/payload/products";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { GroupFilters } from "@/components/products/GroupFilters";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Category } from "@/payload-types";
import { AutoBreadcrumbs } from "@/components/UI/Breadcrumbs/AutoBreadcrumbs";

interface Props {
  params: Promise<{

    categorySlug: string;

  }>;
  searchParams: Promise<{ group?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug: slug } = await params;
  const category = await getCachedCategoryBySlug(slug)();

  if (!category) {
    return Meta.generate({
      title: "Категория не найдена",
      description: "Страница не найдена",
      baseURL,
    });
  }

  return Meta.generate({
    title: category.name,
    description: `Товары категории "${category.name}"`,
    baseURL: baseURL,
    path: `/catalog/${slug}`,
    image: (category.image as Category["image"])?.url || "/og/catalog.jpg",
  });
}

export default async function CategoryProductsPage({ params, searchParams }: Props) {
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
      <AutoBreadcrumbs />
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
      <Suspense fallback={<div className="py-20 text-center text-neutral-weak">Загрузка товаров...</div>}>
        <ProductsGrid
          products={productsData.docs}
          total={productsData.totalDocs}
          emptyMessage={`В категории "${category.name}"${group ? ` в группе "${group}"` : ""} пока нет товаров`}
        />
      </Suspense>
    </Column>
  );
}