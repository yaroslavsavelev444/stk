import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import type { BreadcrumbItem } from "@/components/UI/Breadcrumbs/Breadcrumbs";
import ProductTemplate from "@/modules/products/templates/product-template";
import { baseURL } from "@/resources/content";
import { getCachedProductBySlug } from "@/services/payload";

type ProductPageProps = {
  params: Promise<{
    categorySlug: string;

    productSlug: string;
  }>;
};

/**
 * app/(frontend)/catalog/[slug]/[slug]/page.tsx
 *
 * Страница конкретного товара.
 * Данные получаются через getCachedProductBySlug из Payload Service Layer.
 *
 * Примечание о route-параметрах:
 * Вложенная структура /catalog/[slug]/[slug] означает, что оба сегмента
 * называются "slug" в файловой системе, но в params Next.js
 * последний сегмент будет доступен через тот ключ, который вы задаёте.
 * Если у вас уже есть конкретное имя параметра — замените ниже.
 *
 * Medusa: region, countryCode — удалены.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const productSlug = resolvedParams.productSlug ?? resolvedParams.categorySlug;
  const product = await getCachedProductBySlug(productSlug)();

  if (!product) return { title: "Товар не найден", robots: { index: false } };

  const seo = product.seo as
    | { title?: string; description?: string }
    | undefined;
  const category =
    typeof product.category === "object" ? product.category : null;
  const canonicalPath = `/catalog/${category?.slug ?? resolvedParams.categorySlug}/${product.slug}`;

  const mainImage = product.images?.[0];
  const media = typeof mainImage === "object" ? mainImage : null;
  const ogImage = media?.url
    ? `${baseURL}${media.url}`
    : `${baseURL}/api/og?title=${encodeURIComponent(product.name)}`;

  const title = seo?.title ?? product.name;
  const description = seo?.description ?? product.description;

  return {
    title,
    description,
    alternates: { canonical: `${baseURL}${canonicalPath}` },
    openGraph: {
      title,
      description,
      url: `${baseURL}${canonicalPath}`,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: product.isPublished
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  // Slug продукта — последний сегмент маршрута
  const productSlug = resolvedParams.productSlug ?? resolvedParams.categorySlug;

  const fetcher = getCachedProductBySlug(productSlug);
  const product = await fetcher();

  if (!product) {
    return notFound();
  }
  const category =
    typeof product.category === "object" ? product.category : null;

  const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Главная", href: "/" },
    { title: "Каталог", href: "/catalog" },
    ...(category
      ? [{ title: category.name, href: `/catalog/${category.slug}` }]
      : []),
    {
      title: product.name,
      href: `/catalog/${category?.slug}/${product.slug}`,
    },
  ];

  return (
    <>
      <ProductJsonLd product={product} siteUrl={baseURL} />
      <BreadcrumbJsonLd siteUrl={baseURL} items={breadcrumbItems} />
      <ProductTemplate product={product} breadcrumbItems={breadcrumbItems} />
    </>
  );
}
