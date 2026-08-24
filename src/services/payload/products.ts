import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import type { Product } from "@/payload-types";
import { getPayloadInstance } from "./getPayload";

/** Ссылка на товар для sitemap — без единого лишнего поля. */
export interface ProductSitemapEntry {
  slug: string;
  categoryId: string;
  updatedAt: string;
}

/**
 * Товары для sitemap.
 *
 * Раньше здесь бралась выборка целиком (5000 полных документов), из которой
 * использовались три поля: объект получался в десятки мегабайт, не влезал в
 * data cache Next.js (лимит 2 МБ) и пересобирался на каждый запрос robots/
 * sitemap. `select` + depth 0 оставляют ровно нужное; slug категории sitemap
 * подставляет сам — список категорий он и так грузит.
 */
async function fetchProductsForSitemap(
  limit: number,
): Promise<ProductSitemapEntry[]> {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "products",
    where: { isPublished: { equals: true } },
    sort: "-updatedAt",
    limit,
    pagination: false,
    depth: 0,
    select: { slug: true, category: true, updatedAt: true },
  });

  return result.docs.map((doc) => ({
    slug: doc.slug,
    categoryId:
      typeof doc.category === "string" ? doc.category : String(doc.category),
    updatedAt: doc.updatedAt,
  }));
}

export const getCachedProductsForSitemap = (limit = 5000) =>
  process.env.NODE_ENV === "development"
    ? () => fetchProductsForSitemap(limit)
    : unstable_cache(
        () => fetchProductsForSitemap(limit),
        [`products-sitemap-${limit}`],
        { tags: ["products"], revalidate: false },
      );

async function fetchProductBySlug(slug: string) {
  const payload = await getPayloadInstance();
  const where: Where = {
    slug: { equals: slug },
    isPublished: { equals: true },
  };

  const result = await payload.find({
    collection: "products",
    where,
    limit: 1,
    depth: 2, // ← Важно! Подтягиваем recommendedProducts
  });
  return result.docs[0] as Product | null;
}

export const getCachedProductBySlug = (slug: string) => {
  if (process.env.NODE_ENV === "development") {
    return () => fetchProductBySlug(slug);
  }
  return unstable_cache(() => fetchProductBySlug(slug), [`product-${slug}`], {
    tags: ["products"],
    revalidate: false,
  });
};
