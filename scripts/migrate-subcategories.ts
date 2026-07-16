// scripts/migrate-subcategories.ts
//
// Переносит старое свободнотекстовое поле Products.group в новую коллекцию
// Subcategories (+ Products.subcategory relationship). Для каждой уникальной
// пары (категория, group) среди товаров создаёт (или переиспользует, если
// скрипт уже запускали) одну подкатегорию, привязывает к ней все товары с
// этим значением group и очищает старое поле group.
//
// Идемпотентен: товары, у которых уже проставлен subcategory, не трогает;
// подкатегория с тем же названием и категорией повторно не создаётся.
//
// Запуск: pnpm run migrate:subcategories
//
// Поле group уже удалено из схемы Products, поэтому читаем и подчищаем его
// напрямую через драйвер MongoDB (Payload больше не знает об этом поле), а
// сами Subcategories и Products.subcategory создаём/обновляем через
// Payload Local API — чтобы сработала валидация и хуки инвалидации кэша.
//
// Собственный минимальный buildConfig — см. scripts/seed-content.ts, по той
// же причине (CallbackRequests → "@/services/email" не резолвится вне
// сборки Next.js).
import { MongoClient } from "mongodb";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig, getPayload } from "payload";
import { Categories } from "../src/payload/collections/Categories.ts";
import { Media } from "../src/payload/collections/Media.ts";
import { Products } from "../src/payload/collections/Products.ts";
import { Subcategories } from "../src/payload/collections/Subcategories.ts";

type Payload = Awaited<ReturnType<typeof getPayload>>;

interface LegacyProduct {
  _id: { toString(): string };
  name: string;
  category: { toString(): string };
  group: string;
  subcategory?: unknown;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function ensureSubcategory(
  payload: Payload,
  cache: Map<string, string>,
  categoryId: string,
  rawName: string,
): Promise<string> {
  const cacheKey = `${categoryId}::${rawName}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const name = capitalize(rawName);

  const existing = await payload.find({
    collection: "subcategories",
    where: { category: { equals: categoryId }, name: { equals: name } },
    limit: 1,
  });

  const id = String(
    existing.docs[0]?.id ??
      (
        await payload.create({
          collection: "subcategories",
          data: { name, category: categoryId, isPublished: true },
        })
      ).id,
  );

  cache.set(cacheKey, id);
  return id;
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Не задан MONGODB_URI");
  }

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db();

  const legacyProducts = (await db
    .collection("products")
    .find({ group: { $exists: true, $ne: null } })
    .toArray()) as unknown as LegacyProduct[];

  console.log(`[migrate] Найдено товаров со старым полем group: ${legacyProducts.length}`);

  if (legacyProducts.length === 0) {
    await mongoClient.close();
    console.log("[migrate] Нечего мигрировать.");
    return;
  }

  const config = await buildConfig({
    secret: process.env.PAYLOAD_SECRET || "migration-script",
    db: mongooseAdapter({ url: process.env.MONGODB_URI }),
    collections: [Categories, Products, Subcategories, Media],
  });

  const payload = await getPayload({ config });

  const subcategoryCache = new Map<string, string>();
  let migrated = 0;
  let skipped = 0;

  for (const product of legacyProducts) {
    if (product.subcategory) {
      skipped++;
      continue;
    }

    const categoryId = product.category.toString();
    const subcategoryId = await ensureSubcategory(payload, subcategoryCache, categoryId, product.group);

    await payload.update({
      collection: "products",
      id: product._id.toString(),
      data: { subcategory: subcategoryId },
    });

    console.log(`[migrate] "${product.name}" -> подкатегория "${product.group}" (${subcategoryId})`);
    migrated++;
  }

  await payload.destroy();

  const unsetResult = await db.collection("products").updateMany({ group: { $exists: true } }, { $unset: { group: "" } });
  console.log(`[migrate] Очищено старых полей group: ${unsetResult.modifiedCount}`);

  await mongoClient.close();

  console.log(`[migrate] Готово: перенесено ${migrated}, пропущено (уже мигрированы) ${skipped}`);
  console.log(`[migrate] Создано/переиспользовано подкатегорий: ${subcategoryCache.size}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[migrate] Ошибка:", err);
    process.exit(1);
  });
