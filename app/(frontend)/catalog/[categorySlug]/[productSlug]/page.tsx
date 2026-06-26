import ProductTemplate from '@/modules/products/templates/product-template'
import { getCachedProductBySlug } from '@/services/payload'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'


type ProductPageProps = {
  params: Promise<{

    categorySlug: string;

    productSlug: string;

  }>;
}

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
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Получаем параметры (Next.js 16 — params это Promise)
  const resolvedParams = await params
  // Slug продукта — последний сегмент
  const productSlug = resolvedParams.productSlug ?? resolvedParams.categorySlug

  const fetcher = getCachedProductBySlug(productSlug)
  const product = await fetcher()

  if (!product) {
    return {
      title: 'Товар не найден',
    }
  }

  // SEO-поля из Payload (fields/seo.ts)
  const seo = product.seo as { title?: string; description?: string; image?: unknown } | undefined

  return {
    title: seo?.title ?? product.name,
    description: seo?.description ?? (product.description as string | undefined),
    openGraph: {
      title: seo?.title ?? product.name,
      description: seo?.description ?? (product.description as string | undefined),
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  // Slug продукта — последний сегмент маршрута
  const productSlug = resolvedParams.productSlug ?? resolvedParams.categorySlug

  const fetcher = getCachedProductBySlug(productSlug)
  const product = await fetcher()

  if (!product) {
    return notFound()
  }

  return <ProductTemplate product={product} />
}