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
    depth: 0,
    limit: 200,
  });

  const docs = result.docs as unknown as Subcategory[];

  const hasManualOrder = docs.some(
    (subcategory) => typeof subcategory.order === "number",
  );

  if (!hasManualOrder) {
    return docs;
  }

  return docs.sort((a, b) => {
    const aOrder =
      typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;

    const bOrder =
      typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return 0;
  });
}

export const getCachedSubcategories = (categoryId: string) =>
  process.env.NODE_ENV === "development"
    ? () => fetchSubcategories(categoryId)
    : unstable_cache(
        () => fetchSubcategories(categoryId),
        [`subcategories-${categoryId}`],
        {
          tags: ["subcategories"],
          revalidate: false,
        },
      );
