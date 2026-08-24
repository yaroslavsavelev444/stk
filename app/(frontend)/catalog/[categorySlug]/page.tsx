import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { notFound } from "next/navigation";
import { CatalogProducts } from "@/components/products/CatalogProducts";
import { SubcategoryFilters } from "@/components/products/SubcategoryFilters";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  type BreadcrumbItem,
  Breadcrumbs,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import { baseURL } from "@/resources/content";
import {
  encodeSubParam,
  getVisibleGroups,
  parseSubParam,
} from "@/services/catalog/types";
import {
  getCachedCatalogStructure,
  getCatalogChunk,
} from "@/services/payload/catalog";

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { categorySlug: slug } = await params;
  const { sub } = await searchParams;
  const structure = await getCachedCatalogStructure(slug)();

  if (!structure)
    return Meta.generate({
      title: "Категория не найдена",
      baseURL,
      description: "",
    });

  const { category } = structure;

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

  const structure = await getCachedCatalogStructure(slug)();
  if (!structure) notFound();

  const { category } = structure;

  // Всё, что не является id подкатегории этой категории, отбрасывается: иначе
  // каждый выдуманный краулером `?sub=` превращался бы в отдельный расчёт.
  const selectedIds = parseSubParam(sub, structure);
  const groups = getVisibleGroups(structure, selectedIds);

  // Сервер рисует только первую порцию — остальное клиент подгружает по мере
  // прокрутки (см. CatalogProducts и /api/catalog/[categorySlug]/products).
  const firstChunk = await getCatalogChunk({
    structure,
    groups,
    cursor: { group: 0, page: 0 },
  });

  const selected = new Set(selectedIds);
  const filterItems = [...structure.subcategories].sort((a, b) => {
    // Выбранные — всегда сверху, внутри каждой части сохраняется порядок
    // подкатегорий из админки.
    const aSelected = selected.has(a.id);
    const bSelected = selected.has(b.id);
    if (aSelected === bSelected) return 0;
    return aSelected ? -1 : 1;
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Главная", href: "/" },
    { title: "Каталог", href: "/catalog" },
    { title: category.name, href: `/catalog/${slug}` },
  ];

  const subParam = encodeSubParam(selectedIds);

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
              variant="heading-default-l"
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
      {filterItems.length > 0 && (
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

      {/* Товары. key сбрасывает ленту при смене фильтра — иначе к новой
          выборке дописались бы товары из предыдущей. */}
      <CatalogProducts
        key={subParam}
        categorySlug={slug}
        subParam={subParam}
        groups={groups}
        initialItems={firstChunk.items}
        initialCursor={firstChunk.cursor}
        emptyMessage={`В категории "${category.name}"${
          selectedIds.length > 0 ? " по выбранным подкатегориям" : ""
        } пока нет товаров`}
      />
    </Column>
  );
}
