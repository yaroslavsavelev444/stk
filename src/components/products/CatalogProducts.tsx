"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import {
  type CatalogCardProduct,
  type CatalogChunk,
  type CatalogCursor,
  type CatalogGroup,
  OTHER_GROUP_KEY,
} from "@/services/catalog/types";
import { CatalogSectionHeading } from "./CatalogSectionHeading";
import { ProductsGrid } from "./ProductsGrid";

interface CatalogProductsProps {
  categorySlug: string;
  /** Значение query-параметра `sub` (уже нормализованное сервером). */
  subParam: string;
  /** Все видимые группы с их полными размерами — для заголовков секций. */
  groups: CatalogGroup[];
  /** Первая порция, отрисованная на сервере: без неё каталог был бы пустым до гидратации. */
  initialItems: CatalogCardProduct[];
  /** Позиция следующей порции; null — товары уместились в первую. */
  initialCursor: CatalogCursor | null;
  emptyMessage: string;
}

interface Section {
  key: string;
  title: string;
  total: number;
  items: CatalogCardProduct[];
}

/**
 * Раскладывает плоский поток товаров по секциям подкатегорий. Сервер отдаёт
 * товары уже в порядке групп, поэтому достаточно резать поток там, где
 * меняется groupKey — не нужно ни сортировать, ни знать заранее весь список.
 */
function buildSections(
  items: CatalogCardProduct[],
  groups: CatalogGroup[],
): Section[] {
  const byKey = new Map(groups.map((group) => [group.key, group]));
  const sections: Section[] = [];

  for (const item of items) {
    const last = sections[sections.length - 1];
    if (last && last.key === item.groupKey) {
      last.items.push(item);
      continue;
    }
    const group = byKey.get(item.groupKey);
    sections.push({
      key: item.groupKey,
      title: group?.name ?? "",
      total: group?.total ?? 0,
      items: [item],
    });
  }

  return sections;
}

/** Ряд-заглушка на время подгрузки: держит высоту, чтобы лента не дёргалась. */
function LoadingRow() {
  return (
    <div
      className="mx-auto flex w-full max-w-7xl items-center justify-center gap-3 text-sm"
      style={{ color: "var(--text-muted)", height: "5rem" }}
    >
      <span
        className="inline-block animate-spin rounded-full"
        style={{
          width: "1.125rem",
          height: "1.125rem",
          border: "2px solid var(--border)",
          borderTopColor: "var(--primary)",
        }}
        aria-hidden="true"
      />
      Загружаем товары…
    </div>
  );
}

/**
 * Каталог категории с бесконечной подгрузкой.
 *
 * Сервер рисует первую порцию (нужна для SEO и первого экрана) и передаёт
 * позицию следующей; дальше клиент дозапрашивает порции у
 * /api/catalog/[categorySlug]/products по мере прокрутки. Смена фильтра — это
 * обычная навигация по ссылке: страница перерисовывается сервером, компонент
 * пересоздаётся с новым key и начинает ленту заново.
 */
export function CatalogProducts({
  categorySlug,
  subParam,
  groups,
  initialItems,
  initialCursor,
  emptyMessage,
}: CatalogProductsProps) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState<CatalogCursor | null>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // Подгружаем заранее, за экран до конца списка, — так пользователь почти
  // никогда не упирается в спиннер.
  const { ref: sentinelRef, inView } = useInView({ rootMargin: "600px 0px" });

  const loadMore = useCallback(async () => {
    if (!cursor) return;

    setIsLoading(true);
    setHasError(false);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const params = new URLSearchParams({
        g: String(cursor.group),
        p: String(cursor.page),
      });
      if (subParam) params.set("sub", subParam);

      const response = await fetch(
        `/api/catalog/${encodeURIComponent(categorySlug)}/products?${params}`,
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const chunk: CatalogChunk = await response.json();

      // Порции с сервера не пересекаются, но подстраховка от дублей стоит
      // один Set: повторно отрисованный товар — самый заметный баг
      // бесконечной ленты. Считаем его прямо из предыдущего состояния, чтобы
      // обновление осталось чистой функцией.
      setItems((previous) => {
        const seen = new Set(previous.map((item) => item.id));
        const fresh = chunk.items.filter((item) => !seen.has(item.id));
        return fresh.length > 0 ? [...previous, ...fresh] : previous;
      });
      setCursor(chunk.cursor);
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;
      setHasError(true);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsLoading(false);
      }
    }
  }, [categorySlug, cursor, subParam]);

  useEffect(() => {
    if (inView && cursor && !isLoading && !hasError) void loadMore();
  }, [inView, cursor, isLoading, hasError, loadMore]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const sections = useMemo(() => buildSections(items, groups), [items, groups]);

  // Заголовок не нужен, когда группа ровно одна и она же «Другие товары»:
  // это категория без подкатегорий, там секция просто дублировала бы h1.
  const showHeadings = !(
    groups.length === 1 && groups[0]?.key === OTHER_GROUP_KEY
  );

  if (items.length === 0) {
    return <ProductsGrid products={[]} emptyMessage={emptyMessage} />;
  }

  return (
    <div className="flex w-full flex-col">
      {sections.map((section, index) => (
        <Reveal
          key={section.key}
          translateY={16}
          fillWidth
          delay={Math.min(index * 0.06, 0.3)}
        >
          <section
            style={{
              paddingBottom: "1rem",
              ...(index > 0
                ? {
                    borderTop: "1px solid var(--border-light)",
                    paddingTop: "3rem",
                  }
                : null),
            }}
          >
            {showHeadings && (
              <CatalogSectionHeading
                title={section.title}
                count={section.total}
              />
            )}
            <ProductsGrid products={section.items} />
          </section>
        </Reveal>
      ))}

      <div aria-live="polite">
        {isLoading && <LoadingRow />}

        {hasError && (
          <div
            className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 py-8 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <span>Не удалось загрузить следующие товары.</span>
            <button
              type="button"
              onClick={() => void loadMore()}
              className="rounded-full border px-5 py-2 font-semibold transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              Повторить
            </button>
          </div>
        )}
      </div>

      {cursor && !hasError && (
        <div ref={sentinelRef} aria-hidden="true" style={{ height: "1px" }} />
      )}
    </div>
  );
}
