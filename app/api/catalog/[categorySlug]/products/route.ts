import { type NextRequest, NextResponse } from "next/server";
import {
  type CatalogCursor,
  getVisibleGroups,
  isValidCursor,
  parseSubParam,
} from "@/services/catalog/types";
import {
  getCachedCatalogStructure,
  getCatalogChunk,
} from "@/services/payload/catalog";

/**
 * Порция товаров категории для бесконечной прокрутки.
 *
 * Отдаёт ровно то, что рисует карточка, — десятки килобайт на запрос вместо
 * мегабайтов на страницу. Курсор (`g` — индекс группы, `p` — страница внутри
 * группы) считается из «структуры» категории, поэтому клиент не может
 * попросить произвольный offset, а `sub` валидируется по реальным
 * подкатегориям: несуществующие id просто отбрасываются.
 */

interface RouteContext {
  params: Promise<{ categorySlug: string }>;
}

function parseIndex(value: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : -1;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { categorySlug } = await params;
  const { searchParams } = request.nextUrl;

  const structure = await getCachedCatalogStructure(categorySlug)();
  if (!structure) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const selectedIds = parseSubParam(searchParams.get("sub"), structure);
  const groups = getVisibleGroups(structure, selectedIds);

  const cursor: CatalogCursor = {
    group: parseIndex(searchParams.get("g")),
    page: parseIndex(searchParams.get("p")),
  };

  // Курсор за пределами каталога — не ошибка, а конец ленты: клиент так узнаёт,
  // что подгружать больше нечего.
  if (!isValidCursor(groups, cursor)) {
    return NextResponse.json({ items: [], cursor: null });
  }

  const chunk = await getCatalogChunk({ structure, groups, cursor });

  return NextResponse.json(chunk, {
    headers: {
      // Порция полностью детерминирована для (категория, фильтр, курсор), а
      // содержимое меняется только при правке каталога — можно спокойно
      // держать её в промежуточных кэшах.
      "Cache-Control":
        "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
