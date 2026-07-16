import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import type { Subcategory } from "@/payload-types";
import { getPayloadInstance } from "./getPayload";

async function fetchSubcategories(categoryId: string): Promise<Subcategory[]> {
  const payload = await getPayloadInstance();
  const where: Where = {
    category: { equals: categoryId },
    isPublished: { equals: true },
  };
  const result = await payload.find({
    collection: "subcategories",
    where,
    // Вторичный ключ "name" — стабильный, предсказуемый порядок для
    // подкатегорий с одинаковым (например, ещё не расставленным) order.
    sort: "order,name",
    depth: 0,
    limit: 200,
  });
  return result.docs as unknown as Subcategory[];
}

export const getCachedSubcategories = (categoryId: string) =>
  process.env.NODE_ENV === "development"
    ? () => fetchSubcategories(categoryId)
    : unstable_cache(() => fetchSubcategories(categoryId), [`subcategories-${categoryId}`], {
        tags: ["subcategories"],
        revalidate: false,
      });
