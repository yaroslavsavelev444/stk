import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { groupProductsBySubcategory } from "@/components/products/groupProductsBySubcategory";
import { ProductsBySubcategory } from "@/components/products/ProductsBySubcategory";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { SubcategoryFilters } from "@/components/products/SubcategoryFilters";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  type BreadcrumbItem,
  Breadcrumbs,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import { baseURL } from "@/resources/content";
import { getCachedCategoryBySlug } from "@/services/payload/categories";
import { getCachedProducts } from "@/services/payload/products";
import { getCachedSubcategories } from "@/services/payload/subcategories";

interface Props {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<{ sub?: string }>;
}

function parseSelectedIds(sub?: string): string[] {
  if (!sub) return [];
  return sub
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { categorySlug: slug } = await params;
  const { sub } = await searchParams;
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
    robots: sub
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: Props) {
  const { categorySlug: slug } = await params;
  const { sub } = await searchParams;
  const selectedIds = parseSelectedIds(sub);

  const getCategory = getCachedCategoryBySlug(slug);
  const category = await getCategory();

  if (!category) notFound();

  const subcategories = await getCachedSubcategories(category.id)(); //'''
  const productsData = await getCachedProducts({
    category: category.id,
    limit: 1000,
    sort: "order",
  })();

  const { groups, ungrouped, visibleProducts } = groupProductsBySubcategory({
    products: productsData.docs,
    subcategories,
    selectedIds,
  });

  // Чипы фильтра показываем только для подкатегорий, в которых реально
  // есть опубликованные товары — фильтр, ведущий в заведомо пустой список,
  // это плохой UX.
  const filterItems = subcategories
    .map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      count: productsData.docs.filter((p) => {
        const id =
          typeof p.subcategory === "string" ? p.subcategory : p.subcategory?.id;
        return id === subcategory.id;
      }).length,
    }))
    .filter((item) => item.count > 0);

  const hasSubcategoryLayout = filterItems.length > 0;
  const isEmpty = groups.length === 0 && ungrouped.length === 0;

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
          {category.description && (
            <Text
              variant="heading-default-xl"
              onBackground="neutral-weak"
              wrap="balance"
              style={{ marginTop: "1rem" }}
            >
              {category.description}
            </Text>
          )}
        </Column>
      </Column>

      {/* Фильтр по подкатегориям */}
      {hasSubcategoryLayout && (
        <div
          className="w-full max-w-5xl mx-auto"
          style={{ paddingInline: "1rem" }}
        >
          <SubcategoryFilters
            items={filterItems}
            selectedIds={selectedIds}
            categorySlug={slug}
          />
        </div>
      )}

      {/* Товары */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-neutral-weak">
            Загрузка товаров...
          </div>
        }
      >
        {isEmpty ? (
          <ProductsGrid
            products={[]}
            total={0}
            emptyMessage={`В категории "${category.name}"${
              selectedIds.length > 0 ? " по выбранным подкатегориям" : ""
            } пока нет товаров`}
          />
        ) : hasSubcategoryLayout ? (
          <ProductsBySubcategory groups={groups} ungrouped={ungrouped} />
        ) : (
          <ProductsGrid
            products={visibleProducts}
            total={visibleProducts.length}
          />
        )}
      </Suspense>
    </Column>
  );
}
