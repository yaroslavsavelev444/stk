import { NextRequest, NextResponse } from 'next/server';
import type { Where } from 'payload';
import type { ProductWithCategory } from '@/store/searchStore';
import { getPayloadInstance } from '@/services/payload';

const MAX_QUERY_LENGTH = 100;
const SEARCH_LIMIT = 20;

/**
 * Санитизация строки запроса: обрезка пробелов и ограничение длины.
 * Экранирование не требуется для $text и для Payload `like`.
 */
function sanitizeQuery(raw: string): string {
  return raw.trim().slice(0, MAX_QUERY_LENGTH);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const rawQuery = searchParams.get('q') ?? '';

  if (!rawQuery.trim()) {
    return NextResponse.json(
      { products: [] },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const clean = sanitizeQuery(rawQuery);

  try {
    const payload = await getPayloadInstance();

    let products: ProductWithCategory[] = [];

    try {
      // Пробуем $text-поиск через прямой доступ к MongoDB-коллекции
      // Получаем коллекцию products через Payload db
      const db = payload.db as any; // обходим строгую типизацию
      const collection = db.collections?.products;

      if (!collection) throw new Error('Collection "products" not found');

      // Выполняем $text поиск с сортировкой по релевантности
      const rawDocs = await collection
        .find(
          {
            $text: { $search: clean },
            isPublished: true,
          },
          { projection: { score: { $meta: 'textScore' } } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(SEARCH_LIMIT)
        .toArray();

      if (rawDocs.length > 0) {
        const ids = rawDocs.map((doc: any) => String(doc._id));
        const whereById: Where = { id: { in: ids } };
        const result = await payload.find({
          collection: 'products',
          where: whereById,
          depth: 1,
          limit: SEARCH_LIMIT,
        });
        products = result.docs as unknown as ProductWithCategory[];
      }
    } catch {
      // Fallback: обычный поиск через Payload с `like` (регистронезависимый)
      const whereRegex: Where = {
        and: [
          { isPublished: { equals: true } },
          {
            or: [
              { name: { like: clean } },
              // при необходимости добавить { description: { like: clean } }
            ],
          },
        ],
      };

      const result = await payload.find({
        collection: 'products',
        where: whereRegex,
        depth: 1,
        limit: SEARCH_LIMIT,
        sort: 'name',
      });
      products = result.docs as unknown as ProductWithCategory[];
    }

    // Формируем компактный ответ
    const slim = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: typeof p.category === 'object' && p.category !== null
        ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
        : null,
    }));

    return NextResponse.json(
      { products: slim },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('[Search API] Error:', error);
    return NextResponse.json(
      { products: [], error: 'Search failed' },
      { status: 500 }
    );
  }
}