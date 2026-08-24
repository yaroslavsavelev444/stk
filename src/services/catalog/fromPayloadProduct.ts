import type { Category, Media, Product } from "@/payload-types";
import type { CatalogCardProduct } from "./types";

/**
 * Приводит уже загруженный документ Payload к проекции карточки.
 *
 * Нужен там, где товары приходят не из каталожной пагинации, а «попутно» —
 * например, рекомендованные товары на странице товара уже populate-нуты с
 * depth 2. Сам каталог этой функцией не пользуется: он изначально грузит из БД
 * только поля карточки (см. src/services/payload/catalog.ts).
 */
export function toCatalogCardProduct(
  product: Product,
  groupKey = "",
): CatalogCardProduct {
  const mainImage = product.images?.[0];
  const media =
    typeof mainImage === "object" && mainImage !== null
      ? (mainImage as Media)
      : null;

  const category = product.category as Category | string;
  const categorySlug = typeof category === "string" ? "" : category?.slug || "";

  const imageUrl = media?.url
    ? new URL(media.url, "http://localhost").pathname
    : null;
  const description = product.description?.trim();

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categorySlug,
    description: description || null,
    price: typeof product.price === "number" ? product.price : null,
    showPrice: product.showPrice !== false,
    priceFrom: product.useVariants === true,
    badges: Array.isArray(product.badges) ? product.badges : [],
    image: imageUrl
      ? { url: imageUrl, alt: media?.alt || product.name || "Товар" }
      : null,
    groupKey,
  };
}
